import React, { useEffect, useState } from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import api from '../services/api';
import './Cart.css';

const Cart = () => {
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

    // Buscar todos os veículos para verificar quais ainda estão disponíveis
    api.get('/veiculos')
      .then(response => {
        const veiculosAtuais = response.data;
        const idsDisponiveis = veiculosAtuais
          .filter(v => v.disponivel === true)
          .map(v => v.id);

        const carrinhoAtualizado = storedCart.filter(item => idsDisponiveis.includes(item.id));

        if (carrinhoAtualizado.length !== storedCart.length) {
          alert('Alguns veículos do seu carrinho foram comprados por outros clientes e foram removidos.');
          localStorage.setItem(carrinhoKey, JSON.stringify(carrinhoAtualizado));
        }

        setCartItems(carrinhoAtualizado);
        calculateTotal(carrinhoAtualizado);
      })
      .catch(error => {
        console.error('Erro ao buscar veículos:', error);
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
      alert('Seu carrinho está vazio!');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert('Erro: usuário não encontrado ou não autenticado!');
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
      alert('Compra finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error.response?.data || error.message);
      alert('Erro ao finalizar compra. Tente novamente.');
    }
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
      <h2><FaShoppingCart /></h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h3>{item.modelo}</h3>
              <p>Marca: {item.marca}</p>
              <p>Ano: {item.ano}</p>
              <p>Preço: R$ {item.preco.toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="remove-btn">
              <FaTrash /> Remover
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: R$ {total.toFixed(2)}</h3>
        <button onClick={finalizarCompra} className="finalizar-btn">
          <FaShoppingCart /> Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Cart;
