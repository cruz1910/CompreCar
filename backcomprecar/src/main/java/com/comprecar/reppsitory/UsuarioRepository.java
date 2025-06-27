package com.comprecar.repository;

import com.projeto.model.Usuario;
import com.projeto.enums.TipoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByTipo(TipoUsuario tipo);
}
