package com.comprecar.mapper;


import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.comprecar.dto.ItemPedidoDTO;
import com.comprecar.dto.PedidoDTO;
import com.comprecar.model.ItemPedido;
import com.comprecar.model.Pedido;

@Component
public class PedidoMapper {

    public PedidoDTO toPedidoDTO(Pedido pedido) {
        if (pedido == null) return null;

        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setClienteId(pedido.getCliente().getId());
        dto.setDataPedido(pedido.getDataPedido());
        dto.setStatus(StatusPedido.valueOf(pedido.getStatus()));
        dto.setValorTotal(pedido.getValorTotal());

        Set<ItemPedidoDTO> itensDTO = pedido.getItens().stream()
                .map(this::toItemPedidoDTO)
                .collect(Collectors.toSet());

        dto.setItens(itensDTO);
        return dto;
    }

    public Pedido toPedido(PedidoDTO dto) {
        if (dto == null) return null;

        Pedido pedido = new Pedido();
        pedido.setId(dto.getId());
        pedido.setDataPedido(dto.getDataPedido());
        pedido.setStatus(dto.getStatus() != null ? dto.getStatus().name() : null);
        pedido.setValorTotal(dto.getValorTotal());

        Set<ItemPedido> itens = dto.getItens().stream()
                .map(this::toItemPedido)
                .collect(Collectors.toSet());

        pedido.setItens(itens);
        return pedido;
    }

    public ItemPedidoDTO toItemPedidoDTO(ItemPedido item) {
        if (item == null) return null;
        ItemPedidoDTO dto = new ItemPedidoDTO();
        dto.setId(item.getId());
        dto.setVeiculoId(item.getVeiculo().getId());
        dto.setPreco(item.getPreco());
        return dto;
    }

    public ItemPedido toItemPedido(ItemPedidoDTO dto) {
        if (dto == null) return null;
        ItemPedido item = new ItemPedido();
        item.setId(dto.getId());
        // Veiculo será setado no controller
        return item;
    }
}
