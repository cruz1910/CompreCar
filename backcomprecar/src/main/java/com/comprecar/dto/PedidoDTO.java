package com.comprecar.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import com.comprecar.enums.StatusPedido;

public class PedidoDTO {

    private Long id;

    @NotNull(message = "Cliente é obrigatório")
    private Long clienteId;

    @NotNull(message = "Data do pedido é obrigatória")
    private LocalDateTime dataPedido;

    @NotNull(message = "Status é obrigatório")
    private StatusPedido status;

    @NotNull(message = "Valor total é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor total deve ser maior que zero")
    private BigDecimal valorTotal;

    @NotNull(message = "Itens são obrigatórios")
    @Size(min = 1, message = "O pedido deve conter pelo menos um item")
    private Set<ItemPedidoDTO> itens;

    public PedidoDTO() {}

    public PedidoDTO(Long id, Long clienteId, LocalDateTime dataPedido, StatusPedido status, BigDecimal valorTotal, Set<ItemPedidoDTO> itens) {
        this.id = id;
        this.clienteId = clienteId;
        this.dataPedido = dataPedido;
        this.status = status;
        this.valorTotal = valorTotal;
        this.itens = itens;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }
    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public Set<ItemPedidoDTO> getItens() { return itens; }
    public void setItens(Set<ItemPedidoDTO> itens) { this.itens = itens; }
}