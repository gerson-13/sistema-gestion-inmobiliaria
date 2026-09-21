package com.inmobiliaria.backend.repository;

import com.inmobiliaria.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Búsqueda segura parametrizada por email (previene SQL Injection).
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verificación de existencia por email para evitar duplicados.
     */
    boolean existsByEmail(String email);

    /**
     * Lista usuarios filtrando por rol (ej. 'AGENTE').
     */
    List<Usuario> findByRol(String rol);
}
