import { createContext, useState, useEffect, useCallback } from "react";
import { validarCredenciales } from "./mockUsers";

/**
 * src/auth/AuthContext.jsx
 *
 * Proveedor de sesión MOCK.
 * Sesión activa guardada en localStorage["sesion_actual"].
 *
 * Expone:
 *   usuario       → { id, nombre, email, rol, telefono } | null
 *   iniciarSesion(email, password) → { ok: bool, error?: string }
 *   cerrarSesion()
 *
 * FUTURO: reemplazar validarCredenciales() por fetch a POST /api/auth/login
 * y guardar el JWT devuelto en lugar del objeto de usuario.
 */

const SESSION_KEY = "sesion_actual";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  const iniciarSesion = useCallback((email, password) => {
    const encontrado = validarCredenciales(email, password);
    if (!encontrado) {
      return { ok: false, error: "Credenciales incorrectas o usuario inactivo." };
    }
    // Guardamos solo los campos necesarios para la sesión (sin password)
    const sesion = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      email: encontrado.email,
      rol: encontrado.rol,
      telefono: encontrado.telefono,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    setUsuario(sesion);
    return { ok: true };
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}
