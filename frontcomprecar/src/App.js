// App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { testConnection } from './services/TesteApi';

import NavbarSwitcher from "./components/NavbarSwitcher";
import Register from "./pages/Register";
import Veiculos from "./pages/Veiculos";
import Funcionarios from "./pages/Funcionarios";
import Cart from "./pages/Cart";
import ListaPedidos from "./pages/ListaPedidos";
import PedidosClientes from "./pages/PedidosCliente"
import PagInicial from "./pages/PagInicial"
import Login from "./pages/login";
import PrivateRoute from "./routes/PrivateRoute"
import PrivateRouteAdmin from "./routes/PrivateRouteAdmin"
import PrivateRouteAdminFuncionario from "./routes/PrivateRouteAdminFuncionario"


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testConnection();
        setIsConnected(isConnected);
      } catch {
        setConnectionError(
          "Não foi possível conectar ao servidor. Por favor, verifique se o backend está rodando."
        );
      }
    };
    checkConnection();
  }, []);

  if (!isConnected && connectionError) {
    return (
      <div className="connection-error">
        <h2>{connectionError}</h2>
        <p>Por favor, verifique se:</p>
        <ul>
          <li>O backend está rodando na porta 8080</li>
          <li>O servidor não está retornando erros</li>
        </ul>
      </div>
    );
  }

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const user = getUser();

  return (
    <>
      <NavbarSwitcher />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/painel" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route
          path="/painel"
          element={
            <PrivateRoute>
             <PagInicial />
            </PrivateRoute>
          }
        />
        <Route
          path="/veiculos"
          element={
            <PrivateRouteAdminFuncionario>
              <Veiculos />
            </PrivateRouteAdminFuncionario>
          }
        />
        <Route
          path="/funcionarios"
          element={
            <PrivateRouteAdmin>
              <Funcionarios />
            </PrivateRouteAdmin>
          }
        />
        <Route
          path="/carrinho"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRouteAdminFuncionario>
              <ListaPedidos />
            </PrivateRouteAdminFuncionario>
          }
        />
        <Route
          path="/meus-pedidos"
          element={
            <PrivateRoute>
              <PedidosClientes />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
