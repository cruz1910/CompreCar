import React, { useEffect, useState } from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import api from '../services/api';
import '../style/Carrinho.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';

const Cart = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setCartItems([]);
      setTotal(0);
      return;
    }

    const carrinhoKey = `cart_${user.id}`;
    const storedCart = JSON.parse(localStorage.getItem(carrinhoKey)) || [];

    if (storedCart.length === 0) {
      setCartItems([]);
      setTotal(0);
      return;
    }

    api.get('/veiculos')
      .then(response => {
        const veiculosAtuais = response.data;
        const idsDisponiveis = veiculosAtuais
          .filter(v => v.disponivel === true)
          .map(v => v.id);

        const carrinhoAtualizado = storedCart
          .filter(item => idsDisponiveis.includes(item.id))
          .map(item => ({
            ...item,
            preco: typeof item.preco === 'string'
              ? parseFloat(item.preco.replace(/\./g, '').replace(',', '.'))
              : item.preco
          }));

        if (carrinhoAtualizado.length !== storedCart.length) {
          toast.warning('Alguns veículos do seu carrinho foram comprados por outros clientes e foram removidos.');
          localStorage.setItem(carrinhoKey, JSON.stringify(carrinhoAtualizado));
        }

        setCartItems(carrinhoAtualizado);
        calculateTotal(carrinhoAtualizado);
      })
      .catch(error => {
        toast.error('Erro ao buscar veículos: ' + error.message);
        setCartItems(storedCart);
        calculateTotal(storedCart);
      });
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.preco, 0);
    setTotal(total);
  };

  const removeFromCart = (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return;

    const carrinhoKey = `cart_${user.id}`;
    const updatedCart = cartItems.filter(item => item.id !== id);

    setCartItems(updatedCart);
    localStorage.setItem(carrinhoKey, JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const finalizarCompra = async () => {
    if (cartItems.length === 0) {
      toast.warning('Seu carrinho está vazio!');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      toast.error('Erro: usuário não encontrado ou não autenticado!');
      return;
    }

    const itens = cartItems.map((item) => ({
      veiculoId: item.id,
      preco: item.preco,
    }));

    const valorTotal = cartItems.reduce((acc, v) => acc + v.preco, 0);

    const data = {
      clienteId: user.id,
      dataPedido: new Date().toISOString(),
      status: 'PENDENTE',
      valorTotal,
      itens,
    };

    try {
      await api.post('/pedidos', data);

      const carrinhoKey = `cart_${user.id}`;
      localStorage.removeItem(carrinhoKey);
      setCartItems([]);
      setTotal(0);

      window.dispatchEvent(new Event('pedidoFinalizado'));

      toast.success('Pedido realizado com sucesso! Você pode acompanhar em "Meus Pedidos".');

    } catch (error) {
      const mensagemErro = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      toast.error('Erro ao finalizar pedido: ' + mensagemErro);
    }
  };

  const quebrarDescricao = (texto, tamanho = 50) => {
    if (!texto) return '';
    return texto.match(new RegExp(`.{1,${tamanho}}`, 'g')).join('\n');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Carrinho Vazio</h2>
        <p>Adicione veículos para iniciar sua compra!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={<CustomCloseButton />}
      />
      <h2><FaShoppingCart /></h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-content">
              <div className="item-image">
                <img src={item.imagem} alt={item.modelo} />
              </div>
              <div className="item-info">
                <div className="info-content">
                  <h3>{item.modelo}</h3>
                  <p>Cor: {item.cor}</p>
                  <p>Marca: {item.marca}</p>
                  <p>Ano: {item.ano}</p>
                  <p className="descricao">{quebrarDescricao(item.descricao)}</p>
                  <p>Preço: R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="remove-btn">
              <FaTrash /> Remover
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        <button onClick={finalizarCompra} className="finalizar-btn">
          <FaShoppingCart /> Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Cart;
