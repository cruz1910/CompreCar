package com.comprecar.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.comprecar.dto.VeiculoDTO;
import com.comprecar.service.VeiculoService;

import java.util.List;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculoService service;

    @PostMapping
    public ResponseEntity<VeiculoDTO> criarVeiculo(@RequestBody VeiculoDTO dto) {
        System.out.println("DTO recebido no controller: " + dto);
        VeiculoDTO veiculoCriado = service.criarVeiculo(dto);
        return ResponseEntity.ok(veiculoCriado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VeiculoDTO> atualizar(@PathVariable Long id,
                                                @Valid @RequestBody VeiculoDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(service.atualizarVeiculo(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeiculoDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<VeiculoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/disponiveis-cliente")
    public ResponseEntity<List<VeiculoDTO>> listarDisponiveisParaCliente() {
        return ResponseEntity.ok(service.listarDisponiveisParaCliente());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarVeiculo(id);
        return ResponseEntity.noContent().build();
    }
}
