import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../data/properties";
import { getUsuariosMock } from "../auth/mockUsers";
import { getContactosMock, setContactosMock } from "../data/contactos";
import "./PropertyDetail.css";

const formatPrice = (price, moneda, operacion) => {
  const f = price.toLocaleString("en-US");
  const suffix = operacion === "Alquiler" ? " / mes" : "";
  return `${moneda === "USD" ? "US$" : "S/"} ${f}${suffix}`;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const [activeImg, setActiveImg] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "", fecha: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImg(0);
  }, [id]);

  const handleOpenModal = (type) => {
    setModalType(type);
    setForm({ nombre: "", email: "", telefono: "", mensaje: "", fecha: "" });
    setErrors({});
    setSubmitted(false);
  };

  const validateModal = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (modalType === 'contact' && !form.mensaje.trim()) e.mensaje = "Requerido";
    if (modalType === 'visit' && !form.fecha.trim()) e.fecha = "Requerido";
    return e;
  };

  const handleModalSubmit = (e, agentName, propertyTitle) => {
    e.preventDefault();
    const errs = validateModal();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // MOCK SUBMIT
    const currentContacts = getContactosMock();
    const registro = {
      id: Date.now(),
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      mensaje: form.mensaje,
      fechaPreferida: modalType === 'visit' ? form.fecha : undefined,
      propiedad: propertyTitle,
      propiedad_id: property.id,
      agente: agentName,
      agente_id: property.agente_id,
      origen: modalType === 'contact' ? "Contacto desde propiedad" : "Solicitud de visita",
      tipo: modalType === 'contact' ? "Contacto desde propiedad" : "Solicitud de visita",
      fecha: new Date().toISOString(),
      estado: "Pendiente",
      seguimientos: []
    };
    
    const newList = [registro, ...currentContacts];
    setContactosMock(newList);
    console.log("✅ Registro guardado en MOCK (Propiedad):", registro);
    setSubmitted(true);
  };

  if (!property) {
    return (
      <div className="detail-not-found">
        <div className="not-found">
          <h2>404</h2>
          <h3>Propiedad no encontrada</h3>
          <p>La propiedad que buscas no existe o fue eliminada.</p>
          <Link to="/propiedades" className="btn btn-primary">
            Ver propiedades
          </Link>
        </div>
      </div>
    );
  }

  const agent = getUsuariosMock().find(u => String(u.id) === String(property.agente_id));
  const {
    titulo, operacion, tipo, ubicacion,
    precio, moneda, dormitorios, banos,
    area_construida, area_total,
    descripcion, caracteristicas, imagenes,
  } = property;

  /* ── Ficha técnica: pares etiqueta/valor ── */
  const ficha = [
    { label: "Tipo", value: tipo },
    { label: "Operación", value: operacion },
    { label: "Precio", value: formatPrice(precio, moneda, operacion) },
    area_total      && { label: "Área total",       value: `${area_total} m²` },
    area_construida && { label: "Área construida",  value: `${area_construida} m²` },
    dormitorios !== null && { label: "Dormitorios", value: dormitorios },
    banos !== null  && { label: "Baños",            value: banos },
    { label: "Ubicación", value: ubicacion },
  ].filter(Boolean);

  /* ── Estadísticas rápidas (header) ── */
  const quickStats = [
    area_total      && { lbl: "Terreno",      val: `${area_total} m²`,      icon: "⬛" },
    area_construida && { lbl: "Construcción", val: `${area_construida} m²`, icon: "🏗" },
    dormitorios !== null && { lbl: "Dormitorios", val: dormitorios,          icon: "🛏" },
    banos !== null  && { lbl: "Baños",        val: banos,                    icon: "🚿" },
  ].filter(Boolean);

  /* ── Botón ficha técnica (PDF futuro) ── */
  const handleFichaTecnica = () => {
    // TODO: Implementar generación de PDF cuando exista el backend.
    // Opciones: jsPDF, Puppeteer server-side, o endpoint /api/propiedades/:id/ficha
    alert("La descarga de la ficha técnica estará disponible próximamente.");
  };

  return (
    <div className="detail-page">

      {/* ── Breadcrumb ── */}
      <div className="detail-page-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span>›</span>
            <Link to="/propiedades">Propiedades</Link>
            <span>›</span>
            <span>{titulo}</span>
          </nav>
        </div>
      </div>

      {/* ── Galería ── */}
      <div className="detail-gallery">
        <div className="gallery-main">
          <img
            src={imagenes[activeImg]}
            alt={`${titulo} - imagen ${activeImg + 1}`}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=60";
            }}
          />
        </div>
        {imagenes.length > 1 && (
          <div className="gallery-thumbs">
            {imagenes.map((img, i) => (
              <div
                key={i}
                className={`gallery-thumb${activeImg === i ? " active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img
                  src={img}
                  alt={`miniatura ${i + 1}`}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=50";
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Contenido principal ── */}
      <div className="container">
        <div className="detail-layout">

          {/* ════════════ COLUMNA IZQUIERDA ════════════ */}
          <div className="detail-main">

            {/* ── 1. Encabezado de la propiedad ── */}
            <div className="detail-card">
              {/* Tipo operación + tipo inmueble + ID */}
              <p className="detail-meta-line">
                <span className={`badge badge-${operacion.toLowerCase()}`}>{operacion}</span>
                <span className="detail-tipo-tag">{tipo}</span>
                <span className="detail-id-tag">ID: {property.id}</span>
              </p>

              {/* Precio prominente (como referencia: arriba) */}
              <p className="detail-price">{formatPrice(precio, moneda, operacion)}</p>

              {/* Título */}
              <h1 className="detail-title">{titulo}</h1>

              {/* Ubicación */}
              <p className="detail-location">
                <span className="pin">📍</span>
                {ubicacion}
              </p>

              {/* ── 2. Stats rápidas ── */}
              {quickStats.length > 0 && (
                <div className="detail-stats">
                  {quickStats.map((s, i) => (
                    <div key={i} className="detail-stat">
                      <span className="stat-lbl">{s.lbl}</span>
                      <span className="stat-val">{s.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 3. Descripción ── */}
            <div className="detail-card">
              <h2 className="detail-section-title">Descripción</h2>
              <p className="detail-description">{descripcion}</p>
            </div>

            {/* ── 4. Características generales (ficha técnica en tabla) ── */}
            <div className="detail-card">
              <h2 className="detail-section-title">Características generales</h2>
              <div className="detail-ficha-grid">
                {ficha.map((item, i) => (
                  <div key={i} className="detail-ficha-item">
                    <span className="detail-ficha-label">{item.label}</span>
                    <span className="detail-ficha-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 5. Características adicionales ── */}
            {caracteristicas && caracteristicas.length > 0 && (
              <div className="detail-card">
                <h2 className="detail-section-title">Características adicionales</h2>
                <div className="detail-characteristics">
                  {caracteristicas.map((c, i) => (
                    <div key={i} className="detail-char-item">{c}</div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 6. Ubicación / Mapa (sin modificar) ── */}
            <div className="detail-card">
              <h2 className="detail-section-title">Ubicación</h2>
              <p className="detail-location" style={{ marginBottom: "16px", fontSize: "13px" }}>
                <span className="pin">📍</span>
                {ubicacion}
              </p>
              <div className="detail-map">
                <div className="detail-map-placeholder">
                  <span className="map-icon">🗺️</span>
                  <strong>{ubicacion}</strong>
                  <span style={{ fontSize: "12px" }}>
                    Mapa disponible al conectar con el backend
                  </span>
                </div>
              </div>
            </div>

            {/* ── 6b. Botón Ficha Técnica ── */}
            <div className="detail-ficha-btn-wrap">
              <button
                className="btn btn-dark btn-lg detail-ficha-btn"
                onClick={handleFichaTecnica}
                type="button"
              >
                📄 Descargar Ficha Técnica
              </button>
              {/* TODO: Conectar con generación real de PDF en el backend */}
            </div>

          </div>{/* /detail-main */}

          {/* ════════════ COLUMNA DERECHA: Agente ════════════ */}
          <div className="detail-sidebar">
            {agent && (
              <div className="agent-card">
                <p className="agent-card-title">Agente encargado</p>

                <div className="agent-info">
                  <div className="agent-avatar">
                    <img
                      src={agent.foto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"}
                      alt={agent.nombre}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80";
                      }}
                    />
                  </div>
                  <h3 className="agent-name">{agent.nombre}</h3>
                  <p className="agent-role">{agent.cargo || "Agente Inmobiliario"}</p>
                </div>

                <div className="agent-contacts">
                  <div className="agent-contact-item">
                    <span className="icon">📞</span>
                    <span>{agent.telefono}</span>
                  </div>
                  <div className="agent-contact-item">
                    <span className="icon">✉️</span>
                    <span style={{ wordBreak: "break-all", fontSize: "12px" }}>
                      {agent.email}
                    </span>
                  </div>
                </div>

                <div className="agent-actions">
                  <button onClick={() => handleOpenModal('contact')} className="btn btn-primary" style={{ width: "100%", marginBottom: "10px", justifyContent: "center" }}>
                    Contactar
                  </button>
                  <button onClick={() => handleOpenModal('visit')} className="btn btn-outline" style={{ width: "100%", marginBottom: "10px", justifyContent: "center" }}>
                    🗓️ Solicitar visita
                  </button>
                  <a
                    href={`https://wa.me/${agent.telefono?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    💬 WhatsApp
                  </a>
                </div>

                <p className="agent-note">
                  ¿Te interesa esta propiedad?<br />
                  Escríbenos y te contactamos.
                </p>
              </div>
            )}
          </div>

        </div>{/* /detail-layout */}
      </div>

      {/* ── Modals MOCK ── */}
      {modalType && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="modal-content" style={{ background: "#fff", width: "100%", maxWidth: "500px", borderRadius: "12px", padding: "24px", position: "relative" }}>
            <button onClick={() => setModalType(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}>✖</button>
            
            <h2 style={{ marginTop: 0, marginBottom: "16px", fontSize: "20px", color: "var(--color-primary-dark)" }}>
              {modalType === 'contact' ? "Contactar al agente" : "Solicitar visita"}
            </h2>
            
            <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #eee" }}>
              <strong>Propiedad:</strong> {titulo} <br/>
              <strong>Agente responsable:</strong> {agent?.nombre}
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <span style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}>✅</span>
                <h3 style={{ margin: "0 0 10px 0", color: "var(--color-primary-dark)" }}>¡Mensaje enviado exitosamente!</h3>
                <p style={{ color: "#666", marginBottom: "20px" }}>El agente se pondrá en contacto contigo pronto.</p>
                <button className="btn btn-primary" onClick={() => setModalType(null)} style={{ width: "100%" }}>Cerrar</button>
              </div>
            ) : (
              <form onSubmit={(e) => handleModalSubmit(e, agent?.nombre, titulo)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#333" }}>Nombre completo *</label>
                  <input type="text" style={{ width: "100%", padding: "10px 12px", border: errors.nombre ? "1px solid var(--color-error)" : "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Tu nombre y apellido" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#333" }}>Correo electrónico *</label>
                  <input type="email" style={{ width: "100%", padding: "10px 12px", border: errors.email ? "1px solid var(--color-error)" : "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="tu@correo.com" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#333" }}>Teléfono *</label>
                  <input type="tel" style={{ width: "100%", padding: "10px 12px", border: errors.telefono ? "1px solid var(--color-error)" : "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="+51 999 999 999" />
                </div>

                {modalType === 'visit' && (
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#333" }}>Fecha preferida *</label>
                    <input type="date" style={{ width: "100%", padding: "10px 12px", border: errors.fecha ? "1px solid var(--color-error)" : "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                  </div>
                )}

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#333" }}>{modalType === 'contact' ? "Mensaje *" : "Mensaje opcional"}</label>
                  <textarea style={{ width: "100%", padding: "10px 12px", border: errors.mensaje ? "1px solid var(--color-error)" : "1px solid #ccc", borderRadius: "6px", fontSize: "14px", minHeight: "80px", fontFamily: "inherit", boxSizing: "border-box" }} value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} placeholder={modalType === 'contact' ? "Me interesa esta propiedad..." : "Algún comentario adicional..."} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: "8px", justifyContent: "center" }}>
                  Enviar {modalType === 'contact' ? "mensaje" : "solicitud"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
