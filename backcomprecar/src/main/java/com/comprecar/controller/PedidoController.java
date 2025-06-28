package com.comprecar.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.comprecar.dto.PedidoDTO;
import com.comprecar.maper.PedidoMapper;
import com.comprecar.model.ItemPedido;
import com.comprecar.model.Pedido;
import com.comprecar.model.Usuario;
import com.comprecar.repository.UsuarioRepository;
import com.comprecar.service.PedidoService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private com.comprecar.reppsitory.VeiculoRepository veiculoRepo;

    @Autowired
    private PedidoMapper mapper;

    @PostMapping
    public ResponseEntity<PedidoDTO> criar(@Valid @RequestBody PedidoDTO dto) {
        Usuario cliente = usuarioRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new PedidoException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(dto.getDataPedido());
        pedido.setStatus(dto.getStatus() != null ? dto.getStatus().name() : "PENDENTE");

        // Cria novos itens com veículos carregados
        Set<ItemPedido> itensComVeiculos = dto.getItens().stream().map(itemDTO -> {
            Veiculo veiculo = veiculoRepo.findById(itemDTO.getVeiculoId())
                    .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + itemDTO.getVeiculoId()));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setVeiculo(veiculo);
            item.setPreco(itemDTO.getPreco());

            return item;
        }).collect(Collectors.toSet());

        pedido.setItens(itensComVeiculos);

        Pedido pedidoSalvo = service.criarPedido(pedido);
        return new ResponseEntity<>(mapper.toPedidoDTO(pedidoSalvo), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> buscar(@PathVariable Long id) {
        Pedido pedido = service.buscarPorId(id);
        return ResponseEntity.ok(mapper.toPedidoDTO(pedido));
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> listar() {
        List<PedidoDTO> lista = service.listarPedidos().stream()
                .map(mapper::toPedidoDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoDTO>> listarPorCliente(@PathVariable Long clienteId) {
        List<PedidoDTO> lista = service.listarPedidosPorCliente(clienteId).stream()
                .map(mapper::toPedidoDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> atualizar(@PathVariable Long id,
            @Valid @RequestBody PedidoDTO dto) {
        dto.setId(id);
        Pedido pedido = mapper.toPedido(dto);
        Usuario cliente = usuarioRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new PedidoException("Cliente não encontrado"));
        pedido.setCliente(cliente);

        Set<ItemPedido> itensComVeiculos = dto.getItens().stream().map(itemDTO -> {
            Veiculo veiculo = veiculoRepo.findById(itemDTO.getVeiculoId())
                    .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + itemDTO.getVeiculoId()));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setVeiculo(veiculo);
            item.setPreco(itemDTO.getPreco());

            return item;
        }).collect(Collectors.toSet());

        pedido.setItens(itensComVeiculos);

        Pedido pedidoAtualizado = service.atualizarPedido(pedido);
        return ResponseEntity.ok(mapper.toPedidoDTO(pedidoAtualizado));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PedidoDTO> atualizarStatus(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            StatusPedido novoStatus = StatusPedido.valueOf(body.get("status"));
            Pedido pedidoAtualizado = service.atualizarStatusPedido(id, novoStatus);
            return ResponseEntity.ok(mapper.toPedidoDTO(pedidoAtualizado));
        } catch (IllegalArgumentException e) {
            throw new PedidoException("Status inválido: " + body.get("status"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
