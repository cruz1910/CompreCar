import React, { useState } from 'react'
import "../style/Registro.css"


const Registro = () => {
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
}

export default Registro
