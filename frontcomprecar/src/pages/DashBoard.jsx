import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarVeiculos();
  }, []);

  const listarVeiculos = async () => {
    try {
      const endpoint = user?.tipo === 'CLIENTE'
        ? '/veiculos/disponiveis-cliente'
        : '/veiculos';

      const response = await api.get(endpoint);
      const todosVeiculos = response.data;

      setVeiculos(todosVeiculos);
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      alert('Erro ao carregar veículos.');
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = (veiculo) => {
    const carrinhoKey = `cart_${user.id}`;
    let carrinhoAtual = JSON.parse(localStorage.getItem(carrinhoKey)) || [];

    const jaExiste = carrinhoAtual.find((item) => item.id === veiculo.id);
    if (jaExiste) {
      alert('Este veículo já está no seu carrinho.');
      return;
    }

    const veiculoComQuantidade = { ...veiculo, quantidade: 1 };
    carrinhoAtual.push(veiculoComQuantidade);
    localStorage.setItem(carrinhoKey, JSON.stringify(carrinhoAtual));

    alert('Veículo adicionado ao carrinho com sucesso!');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="vehicles-section">
        {loading ? (
          <div className="loading">Carregando veículos...</div>
        ) : (
          <div className="vehicles-grid">
            {veiculos.length > 0 ? (
              veiculos.map((veiculo) => (
                <div key={veiculo.id} className="vehicle-card">
                  <div className="vehicle-image">
                    {veiculo.imagem && (
                      <img
                        src={veiculo.imagem}
                        alt={veiculo.modelo}
                        className="vehicle-img"
                      />
                    )}
                  </div>
                  <div className="vehicle-info">
                    <h3>{veiculo.marca} {veiculo.modelo}</h3>
                    <p>Ano: {veiculo.ano}</p>
                    <p>Cor: {veiculo.cor}</p>
                    <p>Preço: R$ {veiculo.preco?.toFixed(2)}</p>
                    {veiculo.descricao && (
                      <p className="description">{veiculo.descricao}</p>
                    )}
                    {user.tipo === 'CLIENTE' && (
                      <button
                        className="add-to-cart-btn"
                        onClick={() => adicionarAoCarrinho(veiculo)}
                      >
                        Adicionar ao Carrinho
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-vehicles">Nenhum veículo disponível no momento.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
