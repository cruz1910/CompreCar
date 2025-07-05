import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../style/PagInicial.css';
import '../style/global.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../components/SearchBar';
import '../style/SearchBar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';

const PagInicial = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );
  const user = JSON.parse(localStorage.getItem('user'));
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [originalVeiculos, setOriginalVeiculos] = useState([]);

  useEffect(() => {
    listarVeiculos();
  }, []);

  const listarVeiculos = async () => {
    try {
      const endpoint = user?.tipo === 'CLIENTE'
        ? '/veiculos/disponiveis-cliente'
        : '/veiculos';

      const response = await api.get(endpoint);
      setVeiculos(response.data);
      setOriginalVeiculos(response.data);
    } catch (error) {
      toast.error('Erro ao listar veículos: ' + error.message);
      toast.error('Erro ao carregar veículos.');
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = (veiculo) => {
    const carrinhoKey = `cart_${user.id}`;
    let carrinhoAtual = JSON.parse(localStorage.getItem(carrinhoKey)) || [];

    const jaExiste = carrinhoAtual.find((item) => item.id === veiculo.id);
    if (jaExiste) {
      toast.warning('Este veículo já está no seu carrinho.');
      return;
    }

    const veiculoComQuantidade = { ...veiculo, quantidade: 1 };
    carrinhoAtual.push(veiculoComQuantidade);
    localStorage.setItem(carrinhoKey, JSON.stringify(carrinhoAtual));
    toast.success('Veículo adicionado ao carrinho com sucesso!');
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setVeiculos(originalVeiculos);
      return;
    }

    const filteredVeiculos = originalVeiculos.filter(veiculo =>
      veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.ano.toString().includes(searchTerm) ||
      veiculo.preco.toString().includes(searchTerm)
    );
    setVeiculos(filteredVeiculos);
  };

  const quebrarDescricao = (texto, tamanho = 45) => {
    if (!texto) return '';
    return texto.match(new RegExp(`.{1,${tamanho}}`, 'g')).join('\n');
  };

  if (!user) return null;

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={<CustomCloseButton />}
      />
      <div className="search-container" style={{ marginTop: '20px' }}>
        {showSearch && (
          <SearchBar onSearch={handleSearch} placeholder="Pesquisar por marca, modelo, cor, ano ou preço..." />
        )}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="search-toggle-btn"
        >
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
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
                        <p className="description">{quebrarDescricao(veiculo.descricao)}</p>
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
    </div>
  );
};

export default PagInicial;
