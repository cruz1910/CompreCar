import React, { useState } from 'react'
import "../style/Registro.css"


const Register = () => {
  const [formData, setformData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input "${name}" alterado para: "${value}"`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmacaoSenha) {
      setError('As senhas não coincidem');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return;
    }

    try {
      
      const response = await api.post('/usuarios', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        confirmacaoSenha: formData.confirmacaoSenha, 
      });

      setError('');
      alert('Cadastro realizado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmacaoSenha: ''
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao cadastrar usuário. Por favor, tente novamente.');
    }
  };
  const navigate = useNavigate()

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Cadastro</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmacaoSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmacaoSenha" 
              name="confirmacaoSenha" 
              value={formData.confirmacaoSenha}
              onChange={handleChange}
              required
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
}

export default Register
