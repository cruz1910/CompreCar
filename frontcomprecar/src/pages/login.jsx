import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../style/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
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
      setSenhaError('Senha deve ter no mínimo 8 caracteres');
      isValid = false;
    } else {
      setSenhaError('');
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
      console.error('Erro no login:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Erro ao fazer login. Por favor, tente novamente.');
    }
  };



  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="login-button">Entrar</button>
      </form>
      <p className="register-link">
        Não tem uma conta? <Link to="/cadastro">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;
