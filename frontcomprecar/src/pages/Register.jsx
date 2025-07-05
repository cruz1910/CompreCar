import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../style/global.css';
import '../style/Registro.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Toastify.css';

const Register = () => {
  const CustomCloseButton = ({ closeToast }) => (
    <span onClick={closeToast} className="toastify-close-button">
      ×
    </span>
  );

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Adicionado console.log para ver o que está sendo capturado por handleChange
 
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.senha !== formData.confirmacaoSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    // Adicionados console.log para ver o formData ANTES do envio


    try {
      // Make API call to register the user
      const response = await api.post('/usuarios', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        confirmacaoSenha: formData.confirmacaoSenha, // Este campo é crucial
        tipo: 'CLIENTE' // Default user type
      });

      setError('');
      toast.success('Cadastro realizado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmacaoSenha: ''
      });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar usuário. Por favor, tente novamente.');
    }
  };

  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-box">
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
        <h2>Cadastro</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Nome"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Senha"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmacaoSenha" 
              name="confirmacaoSenha" 
              value={formData.confirmacaoSenha}
              onChange={handleChange}
              required
              placeholder="Confirmar Senha"
            />
          </div>

          <button type="submit" className="register-button">Cadastrar</button>
        </form>

        <p className="login-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;