import { Link } from "react-router-dom";
import "./PropertyCard.css";

const formatPrice = (price, moneda, operacion) => {
  const formatted = price.toLocaleString("en-US");
  const suffix = operacion === "Alquiler" ? " / mes" : "";
  return `${moneda === "USD" ? "US$" : "S/"} ${formatted}${suffix}`;
};

export default function PropertyCard({ property }) {
  const {
    id,
    titulo,
    operacion,
    precio,
    moneda,
    ubicacion,
    dormitorios,
    banos,
    area_construida,
    area_total,
    imagenes,
  } = property;

  return (
    <Link to={`/propiedades/${id}`} className="property-card">
      {/* Image */}
      <div className="property-card-img">
        <img
          src={imagenes[0]}
          alt={titulo}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=60";
          }}
        />
        <div className="property-card-badge">
          <span className={`badge badge-${operacion.toLowerCase()}`}>
            {operacion}
          </span>
        </div>
        <div className="property-card-overlay" />
      </div>

      {/* Body */}
      <div className="property-card-body">
        <h3 className="property-card-title">{titulo}</h3>
        <p className="property-card-price">
          {formatPrice(precio, moneda, operacion)}
        </p>
        <p className="property-card-location">
          <span className="pin">📍</span>
          {ubicacion}
        </p>

        {/* Stats */}
        <div className="property-card-stats">
          {dormitorios !== null && (
            <div className="stat-item">
              <span className="stat-icon">🛏</span>
              <strong>{dormitorios}</strong>
              <span>dorm.</span>
            </div>
          )}
          {banos !== null && (
            <div className="stat-item">
              <span className="stat-icon">🚿</span>
              <strong>{banos}</strong>
              <span>baños</span>
            </div>
          )}
          {area_construida !== null && (
            <div className="stat-item">
              <span className="stat-icon">📐</span>
              <strong>{area_construida}</strong>
              <span>m²</span>
            </div>
          )}
          {area_construida === null && area_total !== null && (
            <div className="stat-item">
              <span className="stat-icon">📐</span>
              <strong>{area_total}</strong>
              <span>m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
