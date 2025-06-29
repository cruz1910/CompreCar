package com.comprecar.mapper;

import com.comprecar.dto.ItemPedidoDTO;
import com.comprecar.model.ItemPedido;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ItemPedidoMapper {
    ItemPedidoDTO toDTO(ItemPedido item);
    ItemPedido toEntity(ItemPedidoDTO dto);
}
