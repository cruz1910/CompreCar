package com.comprecar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.comprecar.dto.VeiculoDTO;
import com.comprecar.model.Veiculo;
import com.comprecar.repository.VeiculoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Transactional
    public VeiculoDTO criarVeiculo(VeiculoDTO dto) {
        Veiculo veiculo = new Veiculo();
        veiculo.setMarca(dto.getMarca());
        veiculo.setModelo(dto.getModelo());
        veiculo.setCor(dto.getCor());
        veiculo.setAno(dto.getAno());
        veiculo.setDescricao(dto.getDescricao());
        veiculo.setPreco(dto.getPreco());
        veiculo.setDisponivel(dto.getDisponivel() != null ? dto.getDisponivel() : true);
        veiculo.setDataCadastro(dto.getDataCadastro() != null ? dto.getDataCadastro() : LocalDate.now().toString());
        veiculo.setImagem(dto.getImagem());

        Veiculo veiculoSalvo = veiculoRepository.save(veiculo);
        return converterParaDto(veiculoSalvo);
    }

    @Transactional
    private VeiculoDTO converterParaDto(Veiculo veiculo) {
        VeiculoDTO dto = new VeiculoDTO();
        dto.setId(veiculo.getId());
        dto.setMarca(veiculo.getMarca());
        dto.setModelo(veiculo.getModelo());
        dto.setCor(veiculo.getCor());
        dto.setAno(veiculo.getAno());
        dto.setDescricao(veiculo.getDescricao());
        dto.setPreco(veiculo.getPreco());
        dto.setDisponivel(veiculo.getDisponivel());
        dto.setDataCadastro(veiculo.getDataCadastro());
        dto.setImagem(veiculo.getImagem());
        return dto;
    }

    @Transactional
    public VeiculoDTO atualizarVeiculo(Long id, VeiculoDTO dto) {
        Veiculo veículoExistente = veiculoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + id));

        veículoExistente.setMarca(dto.getMarca());
        veículoExistente.setModelo(dto.getModelo());
        veículoExistente.setAno(dto.getAno());
        veículoExistente.setPreco(dto.getPreco());

        Veiculo salvo = veiculoRepository.save(veículoExistente);
        return converterParaDto(salvo);
    }

    @Transactional(readOnly = true)
    public VeiculoDTO buscarPorId(Long id) {
        Veiculo v = veiculoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + id));
        return converterParaDto(v);
    }

    @Transactional(readOnly = true)
    public List<VeiculoDTO> listarTodos() {
        return veiculoRepository.findAll().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VeiculoDTO> listarDisponiveisParaCliente() {
        return veiculoRepository.findByDisponivelTrue().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletarVeiculo(Long id) {
        Veiculo v = veiculoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("Veículo não encontrado com ID: " + id));
        veiculoRepository.delete(v);
    }
}