import React, { useEffect, useState } from "react";
import api from "../services/api";
import '../styles/Pedidos.css';

const PedidosCliente = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarPedidos = async () => {
      try {
        // Pega o usuário dentro do efeito para evitar dependência de objeto no useEffect
        const userStr = localStorage.getItem("user");
        if (!userStr) return; // se não tem user, não faz nada
        const user = JSON.parse(userStr);

        if (user.tipo !== "CLIENTE") return;

        const response = await api.get(/pedidos/cliente/$,{user,id});
        setPedidos(response.data);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setErro("Erro ao carregar seus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    buscarPedidos();
  }, []); // executa apenas uma vez após montar o componente

  const cancelarPedido = async (id) => {
    if (!window.confirm("Deseja realmente cancelar este pedido?")) return;

    try {
      await api.put(/pedidos/$,{id}/status, { status: "CANCELADO" });
      setPedidos((anterior) =>
        anterior.map((p) =>
          p.id === id ? { ...p, status: "CANCELADO" } : p
        )
      );
      alert("Pedido cancelado com sucesso.");
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      alert("Erro ao cancelar pedido.");
    }
  };

  // Revalida usuário e tipo para acesso restrito
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || user.tipo !== "CLIENTE") {
    return (
      <div className="container">
        <h2>Acesso Negado</h2>
        <p>Esta área é exclusiva para clientes autenticados.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Meus Pedidos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p style={{ color: "red" }}>{erro}</p>
      ) : pedidos.length === 0 ? (
        <p>Você ainda não realizou pedidos.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Numero do Pedido</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{new Date(pedido.dataPedido).toLocaleDateString()}</td>
                <td>{pedido.status}</td>
                <td>R$ {pedido.valorTotal?.toFixed(2)}</td>
                <td>
                  {pedido.status === "PENDENTE" && (
                    <button
                      className="cancelar"
                      onClick={() => cancelarPedido(pedido.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PedidosCliente;