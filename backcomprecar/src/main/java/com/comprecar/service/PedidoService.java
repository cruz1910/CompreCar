package com.comprecar.service;

import com.comprecar.enums.StatusPedido;
import com.comprecar.exception.PedidoException;
import com.comprecar.model.ItemPedido;
import com.comprecar.model.Pedido;
import com.comprecar.model.Veiculo;
import com.comprecar.repository.ItemPedidoRepository;
import com.comprecar.repository.PedidoRepository;
import com.comprecar.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Transactional
    public Pedido criarPedido(Pedido pedido) {
        validarPedido(pedido);
        verificarDisponibilidadeVeiculos(pedido);
        calcularValorTotal(pedido);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        atualizarDisponibilidadeVeiculos(pedidoSalvo, false);

        return pedidoSalvo;
    }

    @Transactional
    public Pedido atualizarPedido(Pedido pedido) {
        Pedido pedidoExistente = pedidoRepository.findById(pedido.getId())
                .orElseThrow(() -> new PedidoException("Pedido não encontrado com ID: " + pedido.getId()));

        pedido.setCliente(pedidoExistente.getCliente());

        pedido.setItens(null); // Limpa itens para evitar conflito
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        if (pedido.getItens() != null) {
            for (ItemPedido item : pedido.getItens()) {
                if (item.getVeiculo() == null || item.getVeiculo().getId() == null) {
                    throw new PedidoException("Veículo não informado em item do pedido");
                }
                Veiculo veiculo = veiculoRepository.findById(item.getVeiculo().getId())
                        .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + item.getVeiculo().getId()));

                item.setVeiculo(veiculo);
                item.setPedido(pedidoSalvo);
            }
            pedidoSalvo.setItens(pedido.getItens());
        }
        return pedidoRepository.save(pedidoSalvo);
    }

    @Transactional
    public Pedido atualizarStatusPedido(Long id, StatusPedido novoStatus) {
        Pedido pedidoExistente = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("Pedido não encontrado com ID: " + id));

        pedidoExistente.setStatus(novoStatus.name());
        Pedido pedidoAtualizado = pedidoRepository.save(pedidoExistente);

        if (novoStatus == StatusPedido.CANCELADO) {
            atualizarDisponibilidadeVeiculos(pedidoAtualizado, true);
            // Limpar itens no pedido CANCELADO
            pedidoAtualizado.getItens().clear();
            pedidoRepository.save(pedidoAtualizado);
        }

        if (novoStatus == StatusPedido.FINALIZADO) {
            List<ItemPedido> itens = List.copyOf(pedidoAtualizado.getItens());
            pedidoAtualizado.getItens().clear();
            pedidoRepository.save(pedidoAtualizado);
            itemPedidoRepository.deleteAll(itens);

            for (ItemPedido item : itens) {
                Veiculo veiculo = item.getVeiculo();
                if (veiculo != null && !veiculoRelacionadoAOutrosPedidos(veiculo, pedidoAtualizado)) {
                    veiculoRepository.delete(veiculo);
                }
            }
        }

        return pedidoAtualizado;
    }

    @Transactional
    public void deletarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("Pedido não encontrado com ID: " + id));

        atualizarDisponibilidadeVeiculos(pedido, true);

        itemPedidoRepository.deleteAll(pedido.getItens());
        pedidoRepository.delete(pedido);
    }

    @Transactional(readOnly = true)
    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("Pedido não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    // Métodos auxiliares

    private void validarPedido(Pedido pedido) {
        if (pedido.getCliente() == null) {
            throw new PedidoException("Cliente não informado");
        }

        if (pedido.getItens() == null || pedido.getItens().isEmpty()) {
            throw new PedidoException("Nenhum item foi adicionado ao pedido");
        }
    }

    private void verificarDisponibilidadeVeiculos(Pedido pedido) {
        for (ItemPedido item : pedido.getItens()) {
            if (item.getVeiculo() == null || item.getVeiculo().getId() == null) {
                throw new PedidoException("Veículo não informado em item do pedido");
            }

            Veiculo veiculo = veiculoRepository.findById(item.getVeiculo().getId())
                    .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + item.getVeiculo().getId()));

            if (!Boolean.TRUE.equals(veiculo.getDisponivel())) {
                throw new PedidoException("Veículo com ID " + veiculo.getId() + " não está disponível");
            }

            item.setVeiculo(veiculo);
            item.setPreco(veiculo.getPreco());
            item.setPedido(pedido);
        }
    }

    private void calcularValorTotal(Pedido pedido) {
        BigDecimal total = pedido.getItens().stream()
                .map(ItemPedido::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        pedido.setValorTotal(total);
    }

    private void atualizarDisponibilidadeVeiculos(Pedido pedido, boolean disponivel) {
        for (ItemPedido item : pedido.getItens()) {
            Veiculo veiculo = item.getVeiculo();
            veiculo.setDisponivel(disponivel);
            veiculoRepository.save(veiculo);
        }
    }

    private boolean veiculoRelacionadoAOutrosPedidos(Veiculo veiculo, Pedido pedidoAtual) {
        List<ItemPedido> itens = itemPedidoRepository.findByVeiculoId(veiculo.getId());
        for (ItemPedido item : itens) {
            if (!item.getPedido().getId().equals(pedidoAtual.getId())) {
                return true;
            }
        }
        return false;
    }
}
