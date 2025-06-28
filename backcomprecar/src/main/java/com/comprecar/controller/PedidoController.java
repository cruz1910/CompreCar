package com.comprecar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comprecar.repository.UsuarioRepository;
import com.comprecar.service.PedidoService;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @Autowired
    private UsuarioRepository usuarioRepo;

    
    
}
