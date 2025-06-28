import React, { useEffect, useState } from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import '../style/Carrinho.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCartItems(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.preco, 0);
    setTotal(total);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('carrinho', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const finalizarCompra = async () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

  
    const user = JSON.parse(localStorage.getItem('usuario'));
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
      await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
     
      localStorage.removeItem('carrinho');
      setCartItems([]);
      setTotal(0);
  
      window.dispatchEvent(new Event('pedidoFinalizado'));
  
      alert('Compra finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
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
