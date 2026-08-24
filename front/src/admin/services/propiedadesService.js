/**
 * propiedadesService.js
 * Capa de servicio para el módulo de Propiedades (panel administrativo).
 *
 * PREPARADO PARA BACKEND:
 * Estas funciones deberán conectarse a la API REST del backend.
 * Las propiedades creadas aquí serán las mismas que mostrará el frontend público.
 *
 * Flujo futuro:
 *   ADMIN crea propiedad → API → MySQL → GET /propiedades → Frontend público
 *
 * NOTA SOBRE IMÁGENES:
 * La subida de imágenes deberá implementarse con un servicio dedicado.
 * Opciones sugeridas:
 *   - Multer (Node.js) + almacenamiento local o S3
 *   - Cloudinary
 *   - AWS S3
 * Ver función uploadImagenPropiedad() abajo.
 */

// TODO: Descomentar y configurar cuando exista el backend
// const API_BASE = `${import.meta.env.VITE_API_URL}/propiedades`;

export const getPropiedades = async () => {
  // TODO: return fetch(API_BASE).then(r => r.json());
  return [];
};

export const getPropiedadById = async (id) => {
  // TODO: return fetch(`${API_BASE}/${id}`).then(r => r.json());
  return null;
};

export const createPropiedad = async (data) => {
  // TODO:
  // return fetch(API_BASE, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // }).then(r => r.json());
  throw new Error("Backend no implementado aún.");
};

export const updatePropiedad = async (id, data) => {
  // TODO:
  // return fetch(`${API_BASE}/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // }).then(r => r.json());
  throw new Error("Backend no implementado aún.");
};

export const deletePropiedad = async (id) => {
  // TODO:
  // return fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  throw new Error("Backend no implementado aún.");
};

/**
 * Sube la imagen principal de una propiedad.
 * @param {File} file - Archivo de imagen seleccionado por el usuario
 * @param {number|string} propiedadId - ID de la propiedad
 * @returns {Promise<{ url: string }>} URL pública de la imagen
 *
 * IMPLEMENTAR CUANDO EXISTA EL BACKEND:
 * Usar FormData para enviar el archivo al servidor.
 * El backend debe retornar la URL pública de la imagen almacenada.
 */
export const uploadImagenPropiedad = async (file, propiedadId) => {
  // TODO:
  // const formData = new FormData();
  // formData.append("imagen", file);
  // formData.append("propiedadId", propiedadId);
  // return fetch(`${API_BASE}/${propiedadId}/imagen`, {
  //   method: "POST",
  //   body: formData,
  // }).then(r => r.json());
  throw new Error("Servicio de subida de imágenes no implementado aún.");
};

/**
 * Sube múltiples imágenes a la galería de una propiedad.
 * @param {FileList} files
 * @param {number|string} propiedadId
 * @returns {Promise<Array<{ url: string }>>}
 */
export const uploadGaleriaPropiedad = async (files, propiedadId) => {
  // TODO: Similar a uploadImagenPropiedad pero con múltiples archivos
  throw new Error("Servicio de galería no implementado aún.");
};
