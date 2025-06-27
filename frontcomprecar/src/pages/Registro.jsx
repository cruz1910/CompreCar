import React, { useState } from 'react'

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

}

export default Registro
