import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../style/global.css';
import '../style/Login.css';
import carroImg from '../img/carro.jpg';
import AlertMessage from './AlertMessage'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  
  
  const [alertInfo, setAlertInfo] = useState(null); // { type: 'success' | 'error', message: string }

  const validateForm = () => {
    let isValid = true;
    setAlertInfo(null); 

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
    setAlertInfo(null); 

    if (!validateForm()) {
        // Se a validação falhar, da de exibir um alerta de erro geral do formulário
        setAlertInfo({ type: 'error', message: 'Por favor, preencha todos os campos corretamente.' });
        return;
    }

    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Exibe um alerta de sucesso antes de navegar, se desejar
      setAlertInfo({ type: 'success', message: 'Login realizado com sucesso!' });
      
      // Navega após um pequeno delay para que o usuário veja a mensagem de sucesso
      setTimeout(() => {
        navigate('/painel');
      }, 1000); 
      
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      setAlertInfo({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao fazer login. Por favor, tente novamente.'
      });
    }
  };

 
  const handleAlertClose = () => {
    setAlertInfo(null);
  };

  return (
    <div className="login-page-split">
      {/* O AlertMessage será renderizado aqui, fora do fluxo do formulário para ser fixo */}
      {alertInfo && (
        <AlertMessage
          type={alertInfo.type}
          message={alertInfo.message}
          onClose={handleAlertClose}
        />
      )}

      <div className="login-left-half">
        <img src={carroImg} alt="Carro" className="login-image" />
      </div>
      <div className="login-right-half">
        <h1 className="login-title">Bem-vindo de volta!</h1>
        <div className="login-container">
          <h2>Login</h2>
          {/* Remova a linha abaixo, pois o AlertMessage a substituirá para erros gerais */}
          {/* {error && <p className="error">{error}</p>} */}
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
      </div>
    </div>
  );
};

export default Login;