package com.inmobiliaria.backend.controller;

import com.inmobiliaria.backend.dto.AgenteCreateDTO;
import com.inmobiliaria.backend.dto.AgenteResponseDTO;
import com.inmobiliaria.backend.exception.EmailAlreadyExistsException;
import com.inmobiliaria.backend.model.Usuario;
import com.inmobiliaria.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Endpoint exclusivo de ADMIN para crear nuevos Agentes:
     * - Valida los datos y mitiga XSS mediante DTO.
     * - Comprueba que el email no esté duplicado.
     * - Hashea la contraseña con BCrypt antes de persistir en MySQL.
     * - Asigna forzosamente rol = 'AGENTE' (el frontend no puede modificar el rol).
     */
    @PostMapping("/agentes")
    public ResponseEntity<AgenteResponseDTO> crearAgente(@Valid @RequestBody AgenteCreateDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("El correo " + email + " ya se encuentra registrado.");
        }

        Usuario nuevoAgente = new Usuario(
                dto.getNombre().trim(),
                email,
                passwordEncoder.encode(dto.getPassword()),
                "AGENTE", // Asignación forzada por regla de negocio
                dto.getTelefono(),
                dto.getCargo()
        );

        Usuario guardado = usuarioRepository.save(nuevoAgente);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AgenteResponseDTO(guardado));
    }

    /**
     * Endpoint exclusivo de ADMIN para listar todos los usuarios/agentes del sistema.
     */
    @GetMapping("/agentes")
    public ResponseEntity<List<AgenteResponseDTO>> listarAgentes() {
        List<AgenteResponseDTO> lista = usuarioRepository.findAll().stream()
                .map(AgenteResponseDTO::new)
                .toList();
        return ResponseEntity.ok(lista);
    }
}
