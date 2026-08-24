import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

// ── Auth ──────────────────────────────────────────────────
import { AuthProvider } from "./auth/AuthContext";

// ── Public frontend ──────────────────────────────────────
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// ── Admin panel ──────────────────────────────────────────
import Dashboard from "./admin/pages/Dashboard";
import Clientes from "./admin/pages/Clientes";
import Propiedades from "./admin/pages/Propiedades";
import Operaciones from "./admin/pages/Operaciones";
import Alquileres from "./admin/pages/Alquileres";
import Comisiones from "./admin/pages/Comisiones";
import Usuarios from "./admin/pages/Usuarios";
import Reportes from "./admin/pages/Reportes";
import ContactosAgente from "./admin/pages/ContactosAgente";
import PerfilAgente from "./admin/pages/PerfilAgente";

function RequireRole({ rol, children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== rol && rol === "ADMIN") return <Navigate to="/agente/propiedades" replace />;
  if (usuario.rol !== rol && rol === "AGENTE") return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function NotFound() {
  return (
    <div style={{ paddingTop: "68px" }}>
      <div className="not-found">
        <h2>404</h2>
        <h3>Página no encontrada</h3>
        <p>La página que buscas no existe.</p>
        <a href="/" className="btn btn-primary">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

/** Wrapper del frontend público: incluye Navbar y Footer */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── LOGIN ────────────────────────────────────────── */}
          <Route path="/login" element={<Login />} />

          {/* ─── FRONTEND PÚBLICO ─────────────────────────────── */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/propiedades" element={<PublicLayout><Properties /></PublicLayout>} />
          <Route path="/propiedades/:id" element={<PublicLayout><PropertyDetail /></PublicLayout>} />
          <Route path="/nosotros" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* ─── PANEL ADMINISTRATIVO ─────────────────────────── */}
          <Route element={<RequireRole rol="ADMIN"><Outlet /></RequireRole>}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/clientes" element={<Clientes />} />
            <Route path="/admin/propiedades" element={<Propiedades />} />
            <Route path="/admin/operaciones" element={<Operaciones />} />
            <Route path="/admin/alquileres" element={<Alquileres />} />
            <Route path="/admin/comisiones" element={<Comisiones />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/contactos" element={<ContactosAgente />} />
            <Route path="/admin/reportes" element={<Reportes />} />
          </Route>

          {/* ─── PANEL DEL AGENTE ─────────────────────────────── */}
          <Route element={<RequireRole rol="AGENTE"><Outlet /></RequireRole>}>
            <Route path="/agente" element={<Navigate to="/agente/propiedades" replace />} />
            <Route path="/agente/propiedades" element={<Propiedades />} />
            <Route path="/agente/clientes" element={<Clientes />} />
            <Route path="/agente/alquileres" element={<Alquileres />} />
            <Route path="/agente/contactos" element={<ContactosAgente />} />
            <Route path="/agente/perfil" element={<PerfilAgente />} />
          </Route>

          {/* ─── 404 ──────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
