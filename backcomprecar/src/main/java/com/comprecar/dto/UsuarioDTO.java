package com.comprecar.dto;

import java.util.logging.Logger;

import org.slf4j.LoggerFactory;

import com.comprecar.enums.TipoUsuario;
import com.comprecar.exception.UsuarioException;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class UsuarioDTO {
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UsuarioDTO.class);
    private static final int MAX_NOME_LENGTH = 100;
    private static final int MAX_EMAIL_LENGTH = 255;

   public UsuarioDTO() {
        logger.debug("Criado novo DTO vazio");
    }

    public UsuarioDTO(Long id, String nome, String email, String senha, String confirmacaoSenha, TipoUsuario tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.confirmacaoSenha = confirmacaoSenha;
        this.tipo = tipo;
        logger.debug("Criado novo DTO com dados: {}", this);
    }

    public UsuarioDTO(String nome, String email, String senha, String confirmacaoSenha, TipoUsuario tipo) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.confirmacaoSenha = confirmacaoSenha;
        this.tipo = tipo;
        logger.debug("Criado DTO com dados: nome={}, email={}, tipo={}", nome, email, tipo);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            logger.error("Nome inválido");
            throw new UsuarioException("Nome é obrigatório");
        }

        if (nome.length() > MAX_NOME_LENGTH) {
            logger.error("Nome muito longo");
            throw new UsuarioException("Nome deve ter no máximo " + MAX_NOME_LENGTH + " caracteres");
        }

        this.nome = nome;
        logger.debug("Nome definido: {}", nome);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            logger.error("Email inválido");
            throw new UsuarioException("Email é obrigatório");
        }

        if (email.length() > MAX_EMAIL_LENGTH) {
            logger.error("Email muito longo");
            throw new UsuarioException("Email deve ter no máximo " + MAX_EMAIL_LENGTH + " caracteres");
        }

        this.email = email;
        logger.debug("Email definido: {}", email);
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        if (senha != null) {
            if (senha.trim().isEmpty()) {
                logger.error("Senha inválida");
                throw new UsuarioException("A senha não pode ser vazia");
            }
            if (senha.length() < 8) {
                logger.error("Senha muito curta");
                throw new UsuarioException("A senha deve ter ao menos 8 caracteres");
            }
        }
        this.senha = senha;
        logger.debug("Senha definida");
    }

    public void setConfirmacaoSenha(String confirmacaoSenha) {
        if (confirmacaoSenha != null) {
            if (confirmacaoSenha.trim().isEmpty()) {
                logger.error("Confirmação inválida");
                throw new UsuarioException("A confirmação não pode ser vazia");
            }
            if (this.senha != null && !this.senha.equals(confirmacaoSenha)) {
                logger.error("Senhas não coincidem");
                throw new UsuarioException("As senhas não coincidem");
            }
        }
        this.confirmacaoSenha = confirmacaoSenha;
        logger.debug("Confirmação definida");
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        if (tipo == null) {
            logger.error("Tipo de usuário nulo");
            throw new UsuarioException("Tipo de usuário é obrigatório");
        }

        this.tipo = tipo;
        logger.debug("Tipo definido: {}", tipo);
    }

    public String getConfirmacaoSenha() {
        return confirmacaoSenha;
    }
}


