package com.comprecar.controller;

import com.comprecar.dto.UsuarioDTO;

import com.comprecar.exception.UsuarioException;

import com.comprecar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public UsuarioDTO criar(@RequestBody UsuarioDTO dto) {
        return usuarioService.criarUsuario(dto);
    }

    @PutMapping("/{id}")
    public UsuarioDTO atualizar(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        return usuarioService.atualizarUsuario(id, dto);
    }

    @GetMapping
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/funcionarios")
    public List<UsuarioDTO> listarFuncionarios() {
        return usuarioService.listarFuncionarios();
    }

    @GetMapping("/funcionarios/{id}")
    public UsuarioDTO buscarFuncionarioPorId(@PathVariable Long id) {
        return usuarioService.buscarFuncionarioPorId(id);
    }

    @PutMapping("/funcionarios/{id}")
    public UsuarioDTO atualizarFuncionario(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        if (dto.getEmail() != null) {
            UsuarioDTO existing = usuarioService.buscarPorEmail(dto.getEmail());
            if (existing != null && !existing.getId().equals(id)) {
                throw new UsuarioException("Email já cadastrado para outro usuário");
            }
        }
        return usuarioService.atualizarFuncionario(id, dto);
    }

    @DeleteMapping("/funcionarios/{id}")
    public void deletarFuncionario(@PathVariable Long id) {
        usuarioService.deletarFuncionario(id);
    }

    @GetMapping("/{id}")
    public UsuarioDTO buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
    }
}
