import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { properties } from "../data/properties";
import "./Properties.css";

const PER_PAGE = 6;

export default function Properties() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    operacion: searchParams.get("operacion") || "",
    tipos: searchParams.get("tipo") ? [searchParams.get("tipo")] : [],
    distrito: searchParams.get("distrito") || "",
    precioMin: "",
    precioMax: "",
    page: 1,
  });

  const [sort, setSort] = useState("recientes");

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...properties];

    if (filters.operacion) {
      result = result.filter((p) => p.operacion === filters.operacion);
    }
    if (filters.tipos.length > 0) {
      result = result.filter((p) => filters.tipos.includes(p.tipo));
    }
    if (filters.distrito) {
      result = result.filter((p) => p.distrito === filters.distrito);
    }
    if (filters.precioMin !== "") {
      result = result.filter((p) => p.precio >= Number(filters.precioMin));
    }
    if (filters.precioMax !== "") {
      result = result.filter((p) => p.precio <= Number(filters.precioMax));
    }

    switch (sort) {
      case "precio-asc":
        result.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        result.sort((a, b) => b.precio - a.precio);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [filters, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPage = Math.min(filters.page, totalPages || 1);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters((f) => ({ ...f, page }));
  };

  return (
    <div className="properties-page">
      {/* Page header */}
      <div className="properties-page-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span>›</span>
            <span>Propiedades</span>
          </nav>
          <h1>Propiedades</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="properties-layout">
          {/* Filters sidebar */}
          <Filters filters={filters} onChange={handleFiltersChange} />

          {/* Main content */}
          <div>
            {/* Toolbar */}
            <div className="properties-toolbar">
              <p className="properties-count">
                Mostrando <strong>{filtered.length}</strong> propiedad
                {filtered.length !== 1 ? "es" : ""}
              </p>
              <div className="properties-sort">
                <span>Ordenar por:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setFilters((f) => ({ ...f, page: 1 }));
                  }}
                >
                  <option value="recientes">Más recientes</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="properties-grid">
              {paginated.length === 0 ? (
                <div className="properties-empty">
                  <div className="empty-icon">🔍</div>
                  <h3>No se encontraron propiedades</h3>
                  <p>
                    Intenta ajustar los filtros para ver más resultados.
                  </p>
                </div>
              ) : (
                paginated.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
