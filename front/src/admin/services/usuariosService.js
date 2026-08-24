/**
 * usuariosService.js
 * Capa de servicio para el módulo de Usuarios / Agentes.
 *
 * PREPARADO PARA BACKEND + AUTENTICACIÓN.
 *
 * Roles futuros:
 *   ADMIN  → acceso completo al panel /admin/*
 *   AGENTE → acceso limitado al panel /agente/*
 *
 * Cuando se implemente autenticación (JWT):
 *   - El token debe enviarse en el header Authorization: Bearer <token>
 *   - El backend deberá retornar el rol del usuario en el token
 *   - El frontend deberá proteger las rutas según el rol
 *
 * Flujo futuro de autenticación:
 *   POST /auth/login → { token, rol, nombre }
 *   Guardar token en localStorage o cookie httpOnly
 *   Incluir token en todas las peticiones a la API
 */

// const API_BASE = `${import.meta.env.VITE_API_URL}/usuarios`;

export const getUsuarios = async () => {
  // TODO: return fetch(API_BASE, {
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  // }).then(r => r.json());
  return [];
};

export const getUsuarioById = async (id) => {
  // TODO: return fetch(`${API_BASE}/${id}`, { ... }).then(r => r.json());
  return null;
};

export const createUsuario = async (data) => {
  // TODO:
  // return fetch(API_BASE, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   body: JSON.stringify(data),
  // }).then(r => r.json());
  throw new Error("Backend no implementado aún.");
};

export const updateUsuario = async (id, data) => {
  // TODO:
  // return fetch(`${API_BASE}/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   body: JSON.stringify(data),
  // }).then(r => r.json());
  throw new Error("Backend no implementado aún.");
};

export const deleteUsuario = async (id) => {
  // TODO:
  // return fetch(`${API_BASE}/${id}`, {
  //   method: "DELETE",
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  throw new Error("Backend no implementado aún.");
};
