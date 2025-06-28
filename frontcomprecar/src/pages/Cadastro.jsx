import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmacaoError, setConfirmacaoError] = useState('');
  const [error, setError] = useState('');

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

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.post('/usuarios', {
        nome,
        email,
        senha,
        tipo: 'CLIENTE'
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message ||
        error.response?.data ||
        'Erro ao fazer cadastro. Por favor, tente novamente.';
      setError(errorMessage);
    }

  };

  return (
    <div className="login-container">
      <h2>Cadastro</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCadastro}>
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
            placeholder="Confirmar Senha"
            value={confirmacaoSenha}
            onChange={(e) => setConfirmacaoSenha(e.target.value)}
            required
          />
          {confirmacaoError && <p className="error">{confirmacaoError}</p>}
        </div>
        <button type="submit" className="login-button">Cadastrar</button>
      </form>
      <p className="register-link">
        Já tem uma conta? <Link to="/login">Faça login aqui</Link>
      </p>
    </div>
  );
};

export default Cadastro;
