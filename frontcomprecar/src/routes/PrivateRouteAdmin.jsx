import { Navigate } from 'react-router-dom';

const PrivateRouteAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user && user.tipo === 'ADMIN' ? children : <Navigate to="/" />;
};

export default PrivateRouteAdmin;
