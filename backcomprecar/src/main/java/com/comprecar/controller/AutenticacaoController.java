package com.comprecar.controller;

import com.comprecar.dto.LoginRequestDTO;
import com.comprecar.dto.UsuarioDTO;
import com.comprecar.exception.AutenticacaoException;
import com.comprecar.model.Usuario;
import com.comprecar.service.AutenticacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            Usuario usuario = autenticacaoService.autenticar(loginRequest);
            UsuarioDTO dto = new UsuarioDTO(
                usuario.getNome(),
                usuario.getEmail(),
                "", "", // senha omitida
                usuario.getTipo()
            );
            return ResponseEntity.ok(dto);
        } catch (AutenticacaoException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
