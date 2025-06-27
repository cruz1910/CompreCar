package com.comprecar.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


    @Entity
    @Table(name = "intens_pedidos")
    public class ItemPedido {
        @Id
        @GeneratedValue(strategy = GeneratedValue.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "pedido_id", nullable = false)
        private Veiculo veiculo;

        @Column(nullable = false)
        private BigDecimal preco;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Veiculo getVeiculo() {
            return veiculo;
        }

        public void setVeiculo(Veiculo veiculo) {
            this.veiculo = veiculo;
        }

        public BigDecimal getPreco() {
            return preco;
        }

        public void setPreco(BigDecimal preco) {
            this.preco = preco;
        }
        

}
