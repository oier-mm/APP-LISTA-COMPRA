import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinSectionByCode } from "../services/sectionService";
import Navbar from "../components/Navbar";

export default function JoinSection() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!codigo.trim()) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const seccion = await joinSectionByCode(codigo);
      localStorage.setItem("seccionActual", seccion.id);
      navigate("/secciones");
    } catch (error) {
      console.error("Error al unirse a la sección:", error);
      setErrorMsg(error.message || "Error al unirse a la sección");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        {/* CABECERA SUPERIOR FIJA */}
        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Unirse a Sección</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>
        </div>

        {/* CONTENIDO CENTRAL SCROLLABLE */}
        <div className="scrollable-products-area">
          <div className="card">
            <h2>Código de invitación</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="input"
                type="text"
                placeholder="Introduce el código (ej. A1B2C3)"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                disabled={loading}
                autoFocus
              />

              {errorMsg && (
                <div style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px", fontWeight: "bold" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={loading || !codigo.trim()}
              >
                {loading ? "UNIÉNDOSE..." : "UNIRSE"}
              </button>

              <button
                type="button"
                className="secondary-button"
                style={{ marginTop: "10px" }}
                onClick={() => navigate("/secciones")}
              >
                CANCELAR
              </button>
            </form>
          </div>
        </div>

        {/* MENÚ INFERIOR FIJO */}
        <Navbar />

      </div>
    </div>
  );
}