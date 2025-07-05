import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../style/Funcionario.css';
import SearchBar from '../components/SearchBar';
import '../style/SearchBar.css';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';

const Funcionarios = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );
  const [funcionarios, setFuncionarios] = useState([]);
  const [originalFuncionarios, setOriginalFuncionarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleSearchFuncionarios = (searchTerm) => {
    if (!searchTerm) {
      setFuncionarios(originalFuncionarios);
      return;
    }

    const filteredFuncionarios = originalFuncionarios.filter(funcionario =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFuncionarios(filteredFuncionarios);
  };

  useEffect(() => {
    const handleSearch = (event) => {
      const searchTerm = event.detail;
      handleSearchFuncionarios(searchTerm);
    };

    window.addEventListener('search-funcionarios', handleSearch);
    return () => window.removeEventListener('search-funcionarios', handleSearch);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.tipo?.toUpperCase() !== 'ADMIN') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      Navigate('/');
      return;
    }

    listarFuncionarios();
  }, []);

  const listarFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/funcionarios');
      setFuncionarios(response.data);
      setOriginalFuncionarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar a lista de funcionários: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!nome || nome.length < 2) {
      toast.error('Nome deve ter no mínimo 2 caracteres');
      isValid = false;
    }

    if (!email) {
      toast.error('Email é obrigatório');
      isValid = false;
    }

    if (!senha || senha.length < 8) {
      toast.error('A senha deve ter ao menos 8 caracteres');
      isValid = false;
    }

    if (!confirmacaoSenha || senha !== confirmacaoSenha) {
      toast.error('As senhas não coincidem');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const data = {
      nome,
      email,
      senha,
      confirmacaoSenha,
      tipo: 'FUNCIONARIO'
    };

    try {
      if (editId) {
        await api.put(`/usuarios/${editId}`, data);
      } else {
        await api.post('/usuarios', data);
      }

      limparFormulario();
      listarFuncionarios();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erro ao salvar funcionário';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmacaoSenha('');
    setEditId(null);
  };

  const handleEdit = (funcionario) => {
    setEditId(funcionario.id);
    setNome(funcionario.nome);
    setEmail(funcionario.email);
    setSenha('');
    setConfirmacaoSenha('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Definir as funções auxiliares primeiro
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        toast.dismiss(toastId);
        proceedWithDelete(id);
      } else if (e.key === 'Escape') {
        toast.dismiss(toastId);
      }
    };

    const proceedWithDelete = async (id) => {
      setLoading(true);
      try {
        await api.delete(`/usuarios/funcionarios/${id}`);
        setFuncionarios(funcionarios.filter(f => f.id !== id));
        toast.success('Funcionário excluído com sucesso!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Erro ao excluir funcionário');
      } finally {
        setLoading(false);
      }
    };

    // Criar o toast
    const toastId = toast.warning('Deseja realmente excluir este funcionário?', {
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

    // Adicionar botões de confirmação no toast
    toast.update(toastId, {
      render: (
        <div style={{ padding: '16px' }}>
          <p>Deseja realmente excluir este funcionário?</p>
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
    
      <h1>Funcionários</h1>

      <div className="search-container" style={{ marginTop: '20px' }}>
        {showSearch && (
          <SearchBar
            onSearch={(searchTerm) => handleSearchFuncionarios(searchTerm)}
            placeholder="Pesquisar por nome, email ou tipo..."
          />
        )}
        <button onClick={() => setShowSearch(!showSearch)} className="search-toggle-btn">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length > 0 ? (
            funcionarios.map((f) => (
              <tr key={f.id}>
                <td>{f.nome}</td>
                <td>{f.email}</td>
                <td>{f.tipo}</td>
                <td>
                  <button className="buttonEditar" onClick={() => handleEdit(f)}>Editar</button>
                  <button className="buttonExcluir" onClick={() => handleDelete(f.id)}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum funcionário cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        Adicionar Funcionário
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              type="button"
              className="close-modal-btn"
              onClick={() => {
                setShowModal(false);
                limparFormulario();
              }}
            >
              Fechar
            </button>

            <h2>{editId ? 'Editar Funcionário' : 'Cadastrar Funcionário'}</h2>



            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirme a senha"
                  value={confirmacaoSenha}
                  onChange={(e) => setConfirmacaoSenha(e.target.value)}
                  required
                />
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Carregando...' : editId ? 'Atualizar' : 'Cadastrar'}
              </button>
            </form>
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

export default Funcionarios;
