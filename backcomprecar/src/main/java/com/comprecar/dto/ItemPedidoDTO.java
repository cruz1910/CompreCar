package com.comprecar.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ItemPedidoDTO {
    private Long id;

    @NotNull(message = "Veículo é obrigatório")
    private Long veiculoId;

    @NotNull(message = "Preço é obrigatório")
    private BigDecimal preco;

    public ItemPedidoDTO() {
    }

    public ItemPedidoDTO(Long id, Long veiculoId, BigDecimal preco) {
        this.id = id;
        this.veiculoId = veiculoId;
        this.preco = preco;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVeiculoId() {
        return veiculoId;
    }

    public void setVeiculoId(Long veiculoId) {
        this.veiculoId = veiculoId;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}
