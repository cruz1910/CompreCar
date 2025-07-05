import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import '../style/SearchBar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';
import '../style/Veiculos.css';
import '../style/global.css';

const Veiculos = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );
  const [veiculos, setVeiculos] = useState([]);
  const [originalVeiculos, setOriginalVeiculos] = useState([]);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [marcaError, setMarcaError] = useState('');
  const [modeloError, setModeloError] = useState('');
  const [anoError, setAnoError] = useState('');
  const [corError, setCorError] = useState('');
  const [precoError, setPrecoError] = useState('');
  const [descricaoError, setDescricaoError] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const formatPrice = (value) => {
    if (!value) return 'R$ 0,00';
    const number = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  useEffect(() => {
    listarVeiculos();
  }, []);

  const listarVeiculos = async () => {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
      setOriginalVeiculos(response.data);
    } catch (error) {
      toast.error('Erro ao listar veículos: ' + error.message);
      toast.error('Erro ao carregar veículos.');
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) return setVeiculos(originalVeiculos);

    const filtered = originalVeiculos.filter((v) =>
      [v.marca, v.modelo, v.cor, v.ano.toString(), v.preco.toString()].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setVeiculos(filtered);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagem('');
    setImageFile(null);
  };

  const validateForm = () => {
    let isValid = true;
    if (!marca) {
      toast.error('Marca é obrigatória');
      setMarcaError('Marca é obrigatória');
      isValid = false;
    } else setMarcaError('');

    if (!modelo) {
      toast.error('Modelo é obrigatório');
      setModeloError('Modelo é obrigatório');
      isValid = false;
    } else setModeloError('');

    if (!ano || parseInt(ano) < 1900 || parseInt(ano) > nextYear) {
      toast.error(`Ano inválido (1900-${nextYear})`);
      setAnoError(`Ano inválido (1900-${nextYear})`);
      isValid = false;
    } else setAnoError('');

    if (!cor) {
      toast.error('Cor é obrigatória');
      setCorError('Cor é obrigatória');
      isValid = false;
    } else setCorError('');

    if (!preco) {
      toast.error('Preço é obrigatório');
      setPrecoError('Preço é obrigatório');
      isValid = false;
    } else {
      const priceStr = preco.toString();
      const price = parseFloat(priceStr.replace(',', '.'));
      if (isNaN(price) || price <= 0) {
        toast.error('Preço deve ser maior que 0 e usar ponto ou vírgula');
        setPrecoError('Preço deve ser maior que 0 e usar ponto ou vírgula');
        isValid = false;
      } else {
        setPrecoError('');
      }
    }

    if (descricao && descricao.length > 100) {
      toast.error('Descrição deve ter no máximo 100 caracteres');
      setDescricaoError('Descrição deve ter no máximo 100 caracteres');
      isValid = false;
    } else {
      setDescricaoError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let imageUrl = imagem;
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResponse.data;
      }

      const veiculoData = {
        modelo,
        marca,
        ano: parseInt(ano),
        cor,
        descricao,
        preco: parseFloat(preco.replace(',', '.')),
        dataCadastro: new Date().toISOString().split('T')[0],
        imagem: imageUrl,
      };

      if (editId) {
        await api.put(`/veiculos/${editId}`, veiculoData);
      } else {
        await api.post('/veiculos', veiculoData);
      }

      listarVeiculos();
      limparFormulario();
      setShowModal(false);
      toast.success(editId ? 'Atualizado com sucesso!' : 'Cadastrado com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar veículo: ' + error.message);
      toast.error('Erro ao salvar veículo.');
    }
  };

  const limparFormulario = () => {
    setEditId(null);
    setModelo('');
    setMarca('');
    setAno('');
    setCor('');
    setDescricao('');
    setPreco('');
    setImagem('');
    setImageFile(null);
    setMarcaError('');
    setModeloError('');
    setAnoError('');
    setCorError('');
    setPrecoError('');
  };

  const handleEdit = (veiculo) => {
    setEditId(veiculo.id);
    setModelo(veiculo.modelo);
    setMarca(veiculo.marca);
    setAno(veiculo.ano);
    setCor(veiculo.cor);
    setDescricao(veiculo.descricao);
    setPreco(veiculo.preco?.toString().replace('.', ','));
    setImagem(veiculo.imagem);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        toast.dismiss(toastId);
        proceedWithDelete(id);
      } else if (e.key === 'Escape') {
        toast.dismiss(toastId);
      }
    };

    const proceedWithDelete = async (id) => {
      try {
        await api.delete(`/veiculos/${id}`);
        listarVeiculos();
        toast.success('Veículo excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir veículo.');
      }
    };

    const toastId = toast.warning('Deseja realmente excluir este veículo?', {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      onOpen: () => {
        document.addEventListener('keydown', handleKeyDown);
      },
      onClose: () => {
        document.removeEventListener('keydown', handleKeyDown);
      }
    });

    toast.update(toastId, {
      render: (
        <div style={{ padding: '16px' }}>
          <p>Deseja realmente excluir este veículo?</p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button className="toastify-button toastify-button-yes" onClick={() => {
              toast.dismiss(toastId);
              proceedWithDelete(id);
            }}>Sim</button>
            <button className="toastify-button toastify-button-no" onClick={() => toast.dismiss(toastId)}>Não</button>
          </div>
        </div>
      ),
      closeButton: false,
    });
  };

  return (
    <div className="container">
     
      <h1 style={{ marginTop: '30px' }}>Veículos Cadastrados</h1>
      <div className="search-container" style={{ marginTop: '20px' }}>
        {showSearch && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Pesquisar por marca, modelo, cor, ano ou preço..."
          />
        )}
        <button onClick={() => setShowSearch(!showSearch)} className="search-toggle-btn">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Cor</th>
            <th>Preço</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.length > 0 ? (
            veiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.ano}</td>
                <td>{v.cor}</td>
                <td>{formatPrice(v.preco)}</td>
                <td>
                  {v.imagem && <img src={v.imagem} alt={v.modelo} style={{ width: '50px' }} />}
                </td>
                <td>
                  <button onClick={() => handleEdit(v)} className="edit-btn">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="delete-btn">
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhum veículo cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="open-modal-btn" onClick={() => setShowModal(true)} style={{ marginTop: '30px' }}>
        Adicionar Veículo
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editId ? 'Editar Veículo' : 'Cadastrar Veículo'}</h2>
            <form onSubmit={handleSubmit} className="veiculo-form">
              <div className="form-group">
                <div className="field-pair">
                  <div className="field-item">
                    <label>Marca *</label>
                    <input
                      type="text"
                      placeholder="Marca"
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      required
                      minLength="2"
                      maxLength="50"
                    />
                  </div>
                  <div className="field-item">
                    <label>Modelo *</label>
                    <input
                      type="text"
                      placeholder="Modelo"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      required
                      minLength="2"
                      maxLength="50"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="field-pair">
                  <div className="field-item">
                    <label>Cor *</label>
                    <input
                      type="text"
                      placeholder="Cor"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      required
                      minLength="2"
                      maxLength="50"
                    />
                  </div>
                  <div className="field-item">
                    <label>Ano *</label>
                    <input
                      type="number"
                      placeholder="Ano"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      required
                      min="1900"
                      max={nextYear}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="field-item">
                  <label>Preço *</label>
                  <input
                    type="text"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                    pattern="^\d+([.,]\d{1,2})?$"
                    title="Use ponto ou vírgula como separador decimal. Ex: 25000.00 ou 25000,00"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="field-item">
                  <label>Descrição</label>
                  <div className="descricao-container">
                    <textarea
                      placeholder="Descrição"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      maxLength="100"
                      rows="5"
                      className="descricao-textarea"
                    ></textarea>
                    <div className="char-counter">{descricao.length}/100</div>
                  </div>
                </div>
              </div>
              <div className="image-upload-container">
                <input type="file" onChange={handleImageChange} />
                {imagem && (
                  <>
                    <div className="image-preview-section">
                      <div className="image-preview-container">
                        <img src={imagem} alt="Preview" className="image-preview" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                      <button className="remove-image-btn" onClick={handleRemoveImage}>
                        <FontAwesomeIcon icon={faTrash} />
                        Remover foto
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button className="submit-btn" type="submit">
                {editId ? 'Atualizar' : 'Cadastrar'}
              </button>
            </form>
            <button
              className="close-modal-btn"
              onClick={() => {
                setShowModal(false);
                limparFormulario();
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default Veiculos;
