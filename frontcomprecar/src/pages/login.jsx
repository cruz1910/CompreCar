import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../style/global.css';
import '../style/Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';

const Login = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!email) {
      toast.error('Email é obrigatório');
      isValid = false;
    }

    if (!senha) {
      toast.error('Senha é obrigatória');
      isValid = false;
    } else if (senha.length < 8) {
      toast.error('Senha deve ter no mínimo 8 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/painel');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erro ao fazer login. Por favor, tente novamente.'
      );
    }
  };

  return (
    <div className="login-container">
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

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Digite seu email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="form-control"
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit" className="login-button">Entrar</button>
      </form>
      <p className="register-link">
        Não tem uma conta? <Link to="/cadastro">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;
