package com.inmobiliaria.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    /**
     * Endpoint público para verificar el estado del servicio inmobiliario sin autenticación.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> publicStatus() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Portal inmobiliario disponible para navegación pública sin autenticación",
                "loginRequired", false
        ));
    }
}
