package com.comprecar.mapper;

import com.comprecar.dto.UsuarioDTO;
import com.comprecar.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pedidos", ignore = true)
    Usuario toUsuario(UsuarioDTO usuarioDTO);

    @Mapping(target =  "senha", ignore = true)
    @Mapping(target = "confirmacaoSenha", ignore = true)
    UsuarioDTO toUsuarioDTO(Usuario usuario);
}
