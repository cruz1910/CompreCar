package com.comprecar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comprecar.model.Pedido;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteId(Long clienteId);

    // Novo método para listar pedidos que não estejam finalizados
    List<Pedido> findByStatusNot(String status);
}
