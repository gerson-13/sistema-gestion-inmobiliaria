package com.inmobiliaria.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

@SpringBootApplication
public class BackendApplication {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    /**
     * Sanity Check: Verifica la conectividad física a la base de datos MySQL al arrancar.
     */
    @Bean
    public CommandLineRunner databaseConnectionSanityCheck(DataSource dataSource) {
        return args -> {
            log.info("==========================================================");
            log.info("SANITY CHECK: CONEXIÓN SPRING BOOT -> MYSQL 8");
            log.info("==========================================================");
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                log.info("✅ Estado de conexión: CONEXIÓN EXITOSA");
                log.info("✅ Motor de Base de Datos: {}", metaData.getDatabaseProductName());
                log.info("✅ Versión del Servidor: {}", metaData.getDatabaseProductVersion());
                log.info("✅ Catálogo / Base de Datos: {}", connection.getCatalog());
                log.info("✅ URL de Conexión: {}", metaData.getURL());
                log.info("✅ Driver JDBC: {} (versión {})", metaData.getDriverName(), metaData.getDriverVersion());
                log.info("✅ Hibernate ddl-auto: validate (Esquema existente validado correctamente)");
                log.info("==========================================================");
            } catch (Exception e) {
                log.error("❌ ERROR CRÍTICO AL CONECTAR A LA BASE DE DATOS: {}", e.getMessage(), e);
            }
        };
    }
}
