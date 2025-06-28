package com.comprecar.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload") 
public class ImageUploadController {

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping("/imagem")
    public ResponseEntity<String> uploadImage(@RequestParam("imagem") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Por favor, selecione um arquivo para upload.");
        }

        try {
            Path uploadPath = Path.of(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gera um nome único para o arquivo para evitar colisões
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            // Salva o arquivo no disco
            Files.copy(file.getInputStream(), filePath);

            // Retorna a URL da imagem salva.
            // Para acesso local, a URL será a base do seu backend + o caminho do recurso estático.
            String imageUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok().body(imageUrl);

        } catch (IOException e) {
            System.err.println("Erro ao fazer upload da imagem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Falha ao fazer upload da imagem: " + e.getMessage());
        }
    }
}