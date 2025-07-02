import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../style/Funcionario.css';
import SearchBar from '../components/SearchBar';
import '../style/SearchBar.css';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [originalFuncionarios, setOriginalFuncionarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  // Search handler function
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
    // Listen for search events from navbar
    const handleSearch = (event) => {
      const searchTerm = event.detail;
      handleSearchFuncionarios(searchTerm);
    };

    window.addEventListener('search-funcionarios', handleSearch);
    return () => window.removeEventListener('search-funcionarios', handleSearch);
  }, []);

  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmacaoError, setConfirmacaoError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.tipo?.toUpperCase() !== 'ADMIN') {
      alert('Acesso negado. Apenas administradores podem acessar esta página.');
      Navigate('/'); // redireciona para a home ou outra página
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
      console.error('Erro ao listar funcionários:', error);
      alert('Erro ao carregar a lista de funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFuncionarios(originalFuncionarios);
      return;
    }

    const filtered = originalFuncionarios.filter(funcionario => {
      return (
        funcionario.nome.toLowerCase().includes(searchTerm) ||
        funcionario.email.toLowerCase().includes(searchTerm) ||
        funcionario.tipo.toLowerCase().includes(searchTerm)
      );
    });

    setFuncionarios(filtered);
  };

  useEffect(() => {
    listarFuncionarios();
  }, []);

  const validateForm = () => {
    let isValid = true;

    if (!nome) {
      setNomeError('Nome é obrigatório');
      isValid = false;
    } else if (nome.length < 2) {
      setNomeError('Nome deve ter no mínimo 2 caracteres');
      isValid = false;
    } else {
      setNomeError('');
    }

    if (!email) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!senha) {
      setSenhaError('Senha é obrigatória');
      isValid = false;
    } else if (senha.length < 8) {
      setSenhaError('A senha deve ter ao menos 8 caracteres');
      isValid = false;
    } else {
      setSenhaError('');
    }

    if (!confirmacaoSenha) {
      setConfirmacaoError('Confirmação de senha é obrigatória');
      isValid = false;
    } else if (senha !== confirmacaoSenha) {
      setConfirmacaoError('As senhas não coincidem');
      isValid = false;
    } else {
      setConfirmacaoError('');
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

      setNome('');
      setEmail('');
      setSenha('');
      setConfirmacaoSenha('');
      setEditId(null);
      setNomeError('');
      setEmailError('');
      setSenhaError('');
      setConfirmacaoError('');
      setError('');
      listarFuncionarios();
    } catch (err) {
      const msg = err.response?.data?.message ||
        err.response?.data ||
        'Erro ao salvar funcionário';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (funcionario) => {
    setEditId(funcionario.id);
    setNome(funcionario.nome);
    setEmail(funcionario.email);
    setSenha('');
    setConfirmacaoSenha('');
    setNomeError('');
    setEmailError('');
    setSenhaError('');
    setConfirmacaoError('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este funcionário?')) {
      setLoading(true);
      try {
        await api.delete(`/usuarios/funcionarios/${id}`);
        setFuncionarios(funcionarios.filter(f => f.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Erro ao excluir funcionário');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <h1>Gerenciar Funcionários</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {nomeError && <p className="error">{nomeError}</p>}
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          {senhaError && <p className="error">{senhaError}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirme a senha"
            value={confirmacaoSenha}
            onChange={(e) => setConfirmacaoSenha(e.target.value)}
            required
          />
          {confirmacaoError && <p className="error">{confirmacaoError}</p>}
        </div>

        <button className='buttonAtt'
          type="submit"
          disabled={loading}

        >
          {loading ? 'Carregando...' : editId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <h2>Funcionários</h2>
      <div className="search-container" style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="search-toggle-btn"
        >
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
        {showSearch && (
          <SearchBar onSearch={(searchTerm) => {
            handleSearchFuncionarios(searchTerm);
          }} placeholder="Pesquisar por nome, email ou tipo..." />
        )}
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
      </div>
  );
};

export default Funcionarios;
