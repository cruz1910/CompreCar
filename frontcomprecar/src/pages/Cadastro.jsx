import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';
import '../styles/global.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';

const Cadastro = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );
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
      toast.error('Nome é obrigatório');
      setNomeError('Nome é obrigatório');
      isValid = false;
    } else if (nome.length < 2) {
      toast.error('Nome deve ter no mínimo 2 caracteres');
      setNomeError('Nome deve ter no mínimo 2 caracteres');
      isValid = false;
    } else {
      setNomeError('');
    }

    if (!email) {
      toast.error('Email é obrigatório');
      setEmailError('Email é obrigatório');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!senha) {
      toast.error('Senha é obrigatória');
      setSenhaError('Senha é obrigatória');
      isValid = false;
    } else if (senha.length < 8) {
      toast.error('A senha deve ter ao menos 8 caracteres');
      setSenhaError('A senha deve ter ao menos 8 caracteres');
      isValid = false;
    } else {
      setSenhaError('');
    }

    if (!confirmacaoSenha) {
      toast.error('Confirmação de senha é obrigatória');
      setConfirmacaoError('Confirmação de senha é obrigatória');
      isValid = false;
    } else if (senha !== confirmacaoSenha) {
      toast.error('As senhas não coincidem');
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
      toast.success('Cadastro realizado com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      toast.error('Erro no cadastro: ' + (error.response?.data || error.message));
      const errorMessage = error.response?.data?.message ||
        error.response?.data ||
        'Erro ao fazer cadastro. Por favor, tente novamente.';
      toast.error(errorMessage);
    }

  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-center"
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
      <h1>Cadastro</h1>
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
