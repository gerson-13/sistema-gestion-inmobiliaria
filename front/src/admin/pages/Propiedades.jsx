import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminPagination from "../components/AdminPagination";
import { getUsuariosMock } from "../../auth/mockUsers";
import { useAuth } from "../../auth/useAuth";
import { properties } from "../../data/properties";

/**
 * Propiedades — Panel Administrativo
 *
 * Módulo principal para gestionar el catálogo de propiedades.
 *
 * INTEGRACIÓN CON FRONTEND PÚBLICO:
 * Las propiedades creadas aquí serán las mismas que mostrará el sitio público.
 * Cuando exista el backend:
 *   - POST /api/propiedades → crea propiedad
 *   - GET  /api/propiedades → frontend público las muestra en /propiedades
 *
 * IMÁGENES:
 * Ver propiedadesService.js → uploadImagenPropiedad() y uploadGaleriaPropiedad()
 * para ver dónde conectar el servicio de subida de imágenes.
 */

const TIPO_OPTIONS = ["Casa", "Departamento", "Terreno", "Oficina", "Local Comercial"];
const OPERACION_OPTIONS = ["Venta", "Alquiler"];
const ESTADO_OPTIONS = ["Disponible", "Alquilado", "Vendido", "Reservado"];
const MONEDA_OPTIONS = ["USD", "PEN"];

const COLUMNS = [
  "ID", "Título", "Tipo", "Operación", "Precio", "Ubicación", "Estado", "Agente", "Acciones",
];

const INITIAL_FORM = {
  titulo: "",
  tipo: "",
  operacion: "",
  moneda: "USD",
  precio: "",
  ubicacion: "",
  descripcion: "",
  area_construida: "",
  area_total: "",
  dormitorios: "",
  banos: "",
  estado: "Disponible",
  agente_id: "",
  // IMAGEN: la URL real vendrá de uploadImagenPropiedad() cuando haya backend
  imagen_principal: "",
};

export default function Propiedades() {
  const { usuario } = useAuth();
  const isAdmin = usuario?.rol === "ADMIN";
  const [propiedades, setPropiedades] = useState(properties);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const agentes = getUsuariosMock().filter((u) => u.rol === "AGENTE" && u.estado === "Activo");
  const getAgenteName = (id) => {
    const a = getUsuariosMock().find((u) => String(u.id) === String(id));
    return a ? a.nombre : (id ? `Agente #${id}` : "—");
  };

  const baseList = isAdmin ? propiedades : propiedades.filter(p => String(p.agente_id) === String(usuario?.id));

  const filtered = baseList.filter((p) =>
    [p.titulo, p.ubicacion, p.tipo]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEdit = (prop) => {
    setEditingId(prop.id);
    setForm({ ...prop });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.titulo.trim()) return;

    if (editingId !== null) {
      // TODO: updatePropiedad(editingId, form)
      setPropiedades((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      // TODO: createPropiedad(form)
      setPropiedades((prev) => [
        { ...form, id: Date.now() },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  const askDelete = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    // TODO: deletePropiedad(deletingId)
    setPropiedades((prev) => prev.filter((p) => p.id !== deletingId));
    setConfirmOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: Llamar a uploadImagenPropiedad(file, propiedadId) cuando haya backend
    // Por ahora se crea una URL temporal local solo para preview
    const previewUrl = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imagen_principal: previewUrl }));
  };

  return (
    <AdminLayout title="Propiedades">
      <div className="admin-card">
        {/* Header */}
        <div className="admin-card-header">
          <p className="admin-card-title">{isAdmin ? "Propiedades" : "Mis propiedades"}</p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <SearchBar
              placeholder="Buscar propiedad..."
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
            />
            {isAdmin && (
              <button className="btn-admin btn-admin-primary" onClick={openCreate}>
                + Nueva propiedad
              </button>
            )}
          </div>
        </div>

        {/* Table / Empty */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="No hay propiedades registradas"
            message="Haz clic en '+ Nueva propiedad' para agregar la primera propiedad."
            action={
            <button className="btn-admin btn-admin-primary" onClick={openCreate} style={{ display: isAdmin ? 'inline-block' : 'none' }}>
              + Nueva propiedad
            </button>
            }
          />
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    {COLUMNS.map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>
                        <strong style={{ fontSize: "13px" }}>{p.titulo}</strong>
                      </td>
                      <td>{p.tipo || "—"}</td>
                      <td>{p.operacion || "—"}</td>
                      <td>
                        {p.precio
                          ? `${p.moneda === "USD" ? "US$" : "S/"} ${Number(p.precio).toLocaleString("en-US")}`
                          : "—"}
                      </td>
                      <td>{p.ubicacion || "—"}</td>
                      <td>
                        <span className={`status-badge status-${p.estado?.toLowerCase()}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td>{getAgenteName(p.agente_id)}</td>
                      <td>
                        {isAdmin && (
                          <div className="td-actions">
                            <button
                              className="btn-admin-icon btn-edit"
                              onClick={() => openEdit(p)}
                              title="Editar"
                            >✏️</button>
                            <button
                              className="btn-admin-icon btn-delete"
                              onClick={() => askDelete(p.id)}
                              title="Eliminar"
                            >🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar propiedad" : "Nueva propiedad"}
        size="lg"
        footer={
          <>
            <button className="btn-cancel" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-admin btn-admin-primary" onClick={handleSave}>
              {editingId ? "Guardar cambios" : "Crear propiedad"}
            </button>
          </>
        }
      >
        <div className="admin-form">
          {/* Imagen principal */}
          <div className="admin-form-group">
            <label className="admin-form-label">Imagen principal</label>
            {/* TODO: Cuando exista backend, usar uploadImagenPropiedad() */}
            <div
              className="image-upload-area"
              onClick={() => document.getElementById("img-principal").click()}
            >
              {form.imagen_principal ? (
                <img
                  src={form.imagen_principal}
                  alt="Preview"
                  style={{ maxHeight: "120px", borderRadius: "8px", margin: "0 auto" }}
                />
              ) : (
                <>
                  <div className="image-upload-icon">🖼️</div>
                  <p>Haz clic para seleccionar imagen</p>
                  <small>PNG, JPG hasta 5MB — La subida real se implementará con el backend</small>
                </>
              )}
            </div>
            <input
              id="img-principal"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Título y tipo */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Título *</label>
              <input
                className="admin-form-control"
                placeholder="Ej: Casa en La Molina"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Tipo de propiedad</label>
              <select
                className="admin-form-control"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {TIPO_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Operación, moneda, precio */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Operación</label>
              <select
                className="admin-form-control"
                value={form.operacion}
                onChange={(e) => setForm({ ...form, operacion: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {OPERACION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Moneda</label>
              <select
                className="admin-form-control"
                value={form.moneda}
                onChange={(e) => setForm({ ...form, moneda: e.target.value })}
              >
                {MONEDA_OPTIONS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Precio</label>
              <input
                type="number"
                className="admin-form-control"
                placeholder="0.00"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Estado</label>
              <select
                className="admin-form-control"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                {ESTADO_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Ubicación */}
          <div className="admin-form-group">
            <label className="admin-form-label">Ubicación</label>
            <input
              className="admin-form-control"
              placeholder="Ej: La Molina, Lima, Perú"
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
            />
          </div>

          {/* Áreas y habitaciones */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Área construida (m²)</label>
              <input
                type="number"
                className="admin-form-control"
                placeholder="0"
                value={form.area_construida}
                onChange={(e) => setForm({ ...form, area_construida: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Área total (m²)</label>
              <input
                type="number"
                className="admin-form-control"
                placeholder="0"
                value={form.area_total}
                onChange={(e) => setForm({ ...form, area_total: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Dormitorios</label>
              <input
                type="number"
                className="admin-form-control"
                placeholder="0"
                min="0"
                value={form.dormitorios}
                onChange={(e) => setForm({ ...form, dormitorios: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Baños</label>
              <input
                type="number"
                className="admin-form-control"
                placeholder="0"
                min="0"
                value={form.banos}
                onChange={(e) => setForm({ ...form, banos: e.target.value })}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="admin-form-group">
            <label className="admin-form-label">Descripción</label>
            <textarea
              className="admin-form-control"
              placeholder="Descripción detallada de la propiedad..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {/* Agente */}
          <div className="admin-form-group">
            <label className="admin-form-label">Agente responsable</label>
            <select
              className="admin-form-control"
              value={form.agente_id}
              onChange={(e) => setForm({ ...form, agente_id: e.target.value })}
            >
              <option value="">Seleccionar agente ▼</option>
              {agentes.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>

          {/* Galería - placeholder */}
          <div className="admin-form-group">
            <label className="admin-form-label">Galería de imágenes</label>
            <div
              className="image-upload-area"
              style={{ cursor: "default", opacity: 0.7 }}
            >
              <div className="image-upload-icon">🖼️</div>
              <p>Galería múltiple</p>
              <small>
                La subida de múltiples imágenes se implementará con el backend.
                Ver: propiedadesService.js → uploadGaleriaPropiedad()
              </small>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar propiedad?"
        message="Esta acción eliminará la propiedad permanentemente."
      />
    </AdminLayout>
  );
}
