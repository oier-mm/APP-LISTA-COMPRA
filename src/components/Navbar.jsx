import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const handleNavSecciones = () => {
    navigate("/secciones");
  };

  const handleNavListas = () => {
    const seccionActual = localStorage.getItem("seccionActual");
    if (seccionActual) {
      navigate("/listas");
    } else {
      navigate("/secciones");
    }
  };

  const handleNavProductos = () => {
    const listaActual = localStorage.getItem("listaActual");
    const seccionActual = localStorage.getItem("seccionActual");

    if (listaActual) {
      navigate("/productos");
    } else if (seccionActual) {
      navigate("/listas");
    } else {
      navigate("/secciones");
    }
  };

  const handleNavEstadisticas = () => {
    navigate("/estadisticas");
  };

  return (
    <nav className="bottom-navbar">
      <button
        type="button"
        className={`nav-item ${currentPath === "/secciones" ? "active" : ""}`}
        onClick={handleNavSecciones}
      >
        <span className="nav-icon">📂</span>
        <span className="nav-label">SECCIONES</span>
      </button>

      <button
        type="button"
        className={`nav-item ${currentPath === "/listas" ? "active" : ""}`}
        onClick={handleNavListas}
      >
        <span className="nav-icon">📋</span>
        <span className="nav-label">LISTAS</span>
      </button>

      <button
        type="button"
        className={`nav-item ${currentPath === "/productos" ? "active" : ""}`}
        onClick={handleNavProductos}
      >
        <span className="nav-icon">🛒</span>
        <span className="nav-label">PRODUCTOS</span>
      </button>

      <button
        type="button"
        className={`nav-item ${
          currentPath === "/estadisticas" ? "active" : ""
        }`}
        onClick={handleNavEstadisticas}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">ESTADÍSTICAS</span>
      </button>
    </nav>
  );
}