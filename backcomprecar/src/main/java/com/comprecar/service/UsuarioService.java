package com.comprecar.service;

import com.comprecar.dto.UsuarioDTO;
import com.comprecar.enums.TipoUsuario;
import com.comprecar.exception.UsuarioException;
import com.comprecar.mapper.UsuarioMapper;
import com.comprecar.model.Usuario;
import com.comprecar.repository.UsuarioRepository;
import com.comprecar.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class UsuarioService {  
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public UsuarioDTO criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioDTO.getTipo() == null) {
            throw new UsuarioException("Tipo de usuário é obrigatório");
        }

        if (usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()) {
            throw new UsuarioException("Email já cadastrado");
        }

        if (usuarioDTO.getNome() == null || usuarioDTO.getNome().length() < 2) {
            throw new UsuarioException("O nome do usuário deve conter ao menos 2 caracteres");
        }

        if (usuarioDTO.getSenha() != null) {
            if (usuarioDTO.getSenha().trim().isEmpty()) {
                throw new UsuarioException("A senha não pode ser vazia");
            }
            if (usuarioDTO.getSenha().length() < 8) {
                throw new UsuarioException("A senha deve ter ao menos 8 caracteres");
            }
            if (usuarioDTO.getConfirmacaoSenha() == null || usuarioDTO.getConfirmacaoSenha().trim().isEmpty()) {
                throw new UsuarioException("A confirmação não pode ser vazia");
            }
            if (!usuarioDTO.getSenha().equals(usuarioDTO.getConfirmacaoSenha())) {
                throw new UsuarioException("As senhas não coincidem");
            }
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioDTO.getNome());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setTipo(usuarioDTO.getTipo());

        if (usuarioDTO.getSenha() != null) {
            usuario.setSenha(HashUtil.gerarHashSHA256(usuarioDTO.getSenha()));
        }

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return UsuarioMapper.INSTANCE.toUsuarioDTO(savedUsuario);
    }

    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("Usuário não encontrado"));

        usuario.setNome(usuarioDTO.getNome());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setTipo(usuarioDTO.getTipo());

        if (usuarioDTO.getSenha() != null && !usuarioDTO.getSenha().isEmpty()) {
            if (usuarioDTO.getSenha().length() < 8) {
                throw new UsuarioException("A senha deve ter ao menos 8 caracteres");
            }
            if (usuarioDTO.getConfirmacaoSenha() == null || usuarioDTO.getConfirmacaoSenha().trim().isEmpty()) {
                throw new UsuarioException("Confirmação de senha é obrigatória");
            }
            if (!usuarioDTO.getSenha().equals(usuarioDTO.getConfirmacaoSenha())) {
                throw new UsuarioException("As senhas não coincidem");
            }

            usuario.setSenha(HashUtil.gerarHashSHA256(usuarioDTO.getSenha()));
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return UsuarioMapper.INSTANCE.toUsuarioDTO(updatedUsuario);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("Usuário não encontrado"));
        return UsuarioMapper.INSTANCE.toUsuarioDTO(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioException("Usuário não encontrado"));
        return UsuarioMapper.INSTANCE.toUsuarioDTO(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper.INSTANCE::toUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarFuncionarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("Funcionário não encontrado"));

        if (usuario.getTipo() != TipoUsuario.FUNCIONARIO) {
            throw new UsuarioException("Usuário não é um funcionário");
        }

        return UsuarioMapper.INSTANCE.toUsuarioDTO(usuario);
    }

    @Transactional
    public UsuarioDTO atualizarFuncionario(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("Funcionário não encontrado"));

        if (usuario.getTipo() != TipoUsuario.FUNCIONARIO) {
            throw new UsuarioException("Usuário não é um funcionário");
        }

        if (usuarioDTO.getNome() != null) {
            usuario.setNome(usuarioDTO.getNome());
        }
        if (usuarioDTO.getEmail() != null) {
            usuario.setEmail(usuarioDTO.getEmail());
        }
        usuario.setTipo(usuarioDTO.getTipo());

        if (usuarioDTO.getSenha() != null && !usuarioDTO.getSenha().isEmpty()) {
            if (usuarioDTO.getTipo() == TipoUsuario.CLIENTE) {
                if (usuarioDTO.getConfirmacaoSenha() == null || usuarioDTO.getConfirmacaoSenha().isEmpty()) {
                    throw new UsuarioException("Confirmação de senha é obrigatória para alteração");
                }
                if (!usuarioDTO.getSenha().equals(usuarioDTO.getConfirmacaoSenha())) {
                    throw new UsuarioException("As senhas não coincidem");
                }
            }
            usuario.setSenha(HashUtil.gerarHashSHA256(usuarioDTO.getSenha()));
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return UsuarioMapper.INSTANCE.toUsuarioDTO(updatedUsuario);
    }

    @Transactional
    public void deletarFuncionario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("Funcionário não encontrado"));

        if (usuario.getTipo() != TipoUsuario.FUNCIONARIO) {
            throw new UsuarioException("Usuário não é um funcionário");
        }

        usuarioRepository.delete(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarFuncionarios() {
        return usuarioRepository.findByTipo(TipoUsuario.FUNCIONARIO)
                .stream()
                .map(UsuarioMapper.INSTANCE::toUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new UsuarioException("Usuário não encontrado para exclusão");
        }

        try {
            usuarioRepository.deleteById(id);
        } catch (Exception e) {
            throw new UsuarioException(
                    "Não foi possível excluir o usuário. Verifique se ele está associado a outros dados.");
        }

    }
}
