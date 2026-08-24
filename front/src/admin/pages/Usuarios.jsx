import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminPagination from "../components/AdminPagination";
import { getUsuariosMock, setUsuariosMock } from "../../auth/mockUsers";

/**
 * Usuarios / Agentes — Panel Administrativo
 *
 * Módulo para gestionar usuarios del sistema.
 * Solo los ADMIN tienen acceso a este módulo.
 *
 * Roles futuros:
 *   ADMIN  → acceso completo al panel /admin/*
 *   AGENTE → acceso limitado al panel /agente/*
 *
 * Cuando exista autenticación (JWT):
 *   - El token JWT contendrá el rol del usuario
 *   - El frontend validará el rol para mostrar el panel correspondiente
 *   - Ver usuariosService.js para detalles de implementación
 *
 * NOTA: Los agentes del panel público (data/agents.js) son mock data temporal.
 * Cuando haya backend, ambos paneles usarán la misma tabla de usuarios.
 */

const ESTADO_OPTIONS = ["Activo", "Inactivo"];

const COLUMNS = [
  "ID", "Nombre", "Email", "Rol", "Teléfono", "Estado", "Acciones",
];

const INITIAL_FORM = {
  nombre: "",
  email: "",
  rol: "AGENTE",
  telefono: "",
  password: "",
  estado: "Activo",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    setUsuarios(getUsuariosMock());
  }, []);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = usuarios.filter((u) =>
    [u.nombre, u.email, u.rol]
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

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({ 
      nombre: u.nombre, 
      email: u.email, 
      rol: u.rol, 
      telefono: u.telefono, 
      password: u.password || "",
      estado: u.estado 
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nombre.trim() || !form.email.trim()) return;
    let newList;
    if (editingId !== null) {
      newList = usuarios.map((u) => (u.id === editingId ? { ...u, ...form } : u));
    } else {
      newList = [{ ...form, id: Date.now(), rol: "AGENTE" }, ...usuarios];
    }
    setUsuarios(newList);
    setUsuariosMock(newList);
    setModalOpen(false);
  };

  const askDelete = (id) => { setDeletingId(id); setConfirmOpen(true); };
  const handleDelete = () => {
    const newList = usuarios.filter((u) => u.id !== deletingId);
    setUsuarios(newList);
    setUsuariosMock(newList);
    setConfirmOpen(false);
  };

  const rolClass = { ADMIN: "status-admin", AGENTE: "status-agente" };

  return (
    <AdminLayout title="Usuarios / Agentes">
      <div className="admin-card">
        <div className="admin-card-header">
          <p className="admin-card-title">Usuarios / Agentes</p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <SearchBar
              placeholder="Buscar usuario..."
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
            />
            <button className="btn-admin btn-admin-primary" onClick={openCreate}>
              + Nuevo usuario
            </button>
          </div>
        </div>

        <div style={{
          margin: "0 24px",
          padding: "10px 14px",
          background: "rgba(201, 168, 76, 0.06)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#a8872e",
          marginBottom: "4px",
          marginTop: "16px",
        }}>
          📝 Los usuarios creados aquí tendrán el rol de AGENTE y se guardan en la sesión actual.
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="👤"
            title="No hay usuarios registrados"
            message="Haz clic en '+ Nuevo usuario' para agregar el primer usuario o agente."
            action={
              <button className="btn-admin btn-admin-primary" onClick={openCreate}>
                + Nuevo usuario
              </button>
            }
          />
        ) : (
          <>
            <div className="admin-table-wrapper" style={{ marginTop: "16px" }}>
              <table className="admin-table">
                <thead>
                  <tr>{COLUMNS.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {paginated.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            background: u.rol === "ADMIN" ? "#c9a84c" : "#3b82f6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 700, fontSize: "11px", flexShrink: 0,
                          }}>
                            {u.nombre?.[0]?.toUpperCase()}
                          </div>
                          {u.nombre}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`status-badge ${rolClass[u.rol] || ""}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>{u.telefono || "—"}</td>
                      <td>
                        <span className={`status-badge status-${u.estado?.toLowerCase()}`}>
                          {u.estado}
                        </span>
                      </td>
                      <td>
                        <div className="td-actions">
                          <button className="btn-admin-icon btn-edit" onClick={() => openEdit(u)} title="Editar">✏️</button>
                          <button className="btn-admin-icon btn-delete" onClick={() => askDelete(u.id)} title="Eliminar">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              currentPage={page} totalPages={totalPages}
              totalItems={filtered.length} perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar usuario" : "Nuevo usuario"}
        footer={
          <>
            <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-admin btn-admin-primary" onClick={handleSave}>
              {editingId ? "Guardar cambios" : "Crear usuario"}
            </button>
          </>
        }
      >
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Nombre completo *</label>
              <input className="admin-form-control" placeholder="Nombre completo"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email *</label>
              <input type="email" className="admin-form-control" placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Teléfono</label>
              <input className="admin-form-control" placeholder="+51 999 999 999"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Rol</label>
              <input className="admin-form-control" value="AGENTE" disabled style={{ background: "#f5f5f5" }} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Estado</label>
              <select className="admin-form-control" value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {ESTADO_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Contraseña inicial</label>
              <input type="text" className="admin-form-control" placeholder="Ej. agente123"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen} onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete} title="¿Eliminar usuario?"
        message="Esta acción eliminará el usuario permanentemente. Esta operación no se puede deshacer."
      />
    </AdminLayout>
  );
}
