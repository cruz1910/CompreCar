import api from './api';

export const testConnection = async () => {
  try {
    const response = await api.get('/');
    console.log('Conexão com backend bem-sucedida:', response.data);
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o backend:', error.response?.data || error.message);
    return false;
  }
};
