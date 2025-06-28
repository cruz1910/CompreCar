package com.comprecar.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.comprecar.dto.VeiculoDTO;
import com.comprecar.model.Veiculo;

@Mapper(componentModel = "spring")
public interface VeiculoMapper {

    @Mapping(target = "dataCadastro", ignore = true)
    Veiculo toVeiculo(VeiculoDTO veiculoDTO);

    VeiculoDTO toVeiculoDTO(Veiculo veiculo);
}
