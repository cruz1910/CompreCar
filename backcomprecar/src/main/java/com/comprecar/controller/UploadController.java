package com.comprecar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
public class UploadController {

    private final Path uploadDir = Paths.get("uploads");

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Por favor, selecione um arquivo");
            }

            // Gerar um nome único para o arquivo
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            
            // Criar diretório se não existir
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Salvar arquivo
            Path targetLocation = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);

            // Retornar URL do arquivo
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

            return ResponseEntity.ok(fileDownloadUri);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erro ao fazer upload do arquivo: " + e.getMessage());
        }
    }

    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String fileName) {
        try {
            Path filePath = uploadDir.resolve(fileName);
            Resource resource = new org.springframework.core.io.FileSystemResource(filePath.toFile());

            if (resource.exists()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename())
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
