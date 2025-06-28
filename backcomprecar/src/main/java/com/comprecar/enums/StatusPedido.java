package com.comprecar.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum StatusPedido {
    
     @JsonProperty("PENDENTE")
    PENDENTE("Pendente"),

    @JsonProperty("EM_PROCESSAMENTO")
    EM_PROCESSAMENTO("Em Processamento"),

    @JsonProperty("FINALIZADO")
    FINALIZADO("Finalizado"),

    @JsonProperty("CANCELADO")
    CANCELADO("Cancelado");

    private final String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}

