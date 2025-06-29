import { Navigate } from 'react-router-dom';

const PrivateRouteAdminFuncionario = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.tipo === 'ADMIN' || user.tipo === 'FUNCIONARIO') {
    return children;
  }

  // Se for CLIENTE ou outro tipo
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
    </div>
  );
};

export default PrivateRouteAdminFuncionario;
