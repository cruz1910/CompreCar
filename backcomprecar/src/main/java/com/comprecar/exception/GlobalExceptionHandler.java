package com.comprecar.exception;



import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsuarioException.class)
    public ResponseEntity<Map<String, String>> handleUsuarioException(UsuarioException ex) {
        // Retorna JSON com a chave "message" e o texto da mensagem do erro
        return new ResponseEntity<>(
            Map.of("message", ex.getMessage()),
            HttpStatus.BAD_REQUEST
        );
    }
   

}
