package com.comprecar.mapper;

import org.mapstruct.Mapper;

import com.comprecar.dto.ItemPedidoDTO;
import com.comprecar.model.ItemPedido;

@Mapper(componentModel = "spring")
public interface ItemPedidoMapper {
    ItemPedidoDTO toDTO(ItemPedido item);
    ItemPedido toEntity(ItemPedidoDTO dto);
}