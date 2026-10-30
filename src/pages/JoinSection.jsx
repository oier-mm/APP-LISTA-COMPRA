import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../styles/sections.css";

export default function JoinSection() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    const codigoTrim = codigo.trim().toUpperCase();
    if (!codigoTrim) {
      setError("Por favor, introduce un código válido.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const sectionsRef = collection(db, "sections");
      const allSectionsSnapshot = await getDocs(sectionsRef);
      let targetSection = null;

      allSectionsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const secCode = data.codigo || docSnap.id.slice(0, 6).toUpperCase();
        if (secCode === codigoTrim || docSnap.id === codigo.trim()) {
          targetSection = { id: docSnap.id, ...data };
        }
      });

      if (!targetSection) {
        setError("No se ha encontrado ninguna sección con ese código.");
        setLoading(false);
        return;
      }

      const miembros = targetSection.miembros || [];
      if (!miembros.includes(user.uid)) {
        const sectionRef = doc(db, "sections", targetSection.id);
        await updateDoc(sectionRef, {
          miembros: arrayUnion(user.uid)
        });
      }

      localStorage.setItem("seccionActual", targetSection.id);
      navigate("/listas");

    } catch (err) {
      console.error("Error al unirse a la sección:", err);
      setError("Hubo un error al unirse. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

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

        <div className="scrollable-products-area" style={{ padding: "20px" }}>
          <div className="card" style={{ padding: "20px", background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ color: "#4a5568", fontSize: "14px", marginBottom: "20px", textAlign: "center" }}>
              Introduce el código de la sección a la que deseas unirte.
            </p>

            <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#2d3748", marginBottom: "6px" }}>
                  CÓDIGO DE LA SECCIÓN
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej: ABC123"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e0",
                    outline: "none",
                    textAlign: "center",
                    letterSpacing: "2px",
                    fontWeight: "bold"
                  }}
                  required
                />
              </div>

              {error && (
                <p style={{ color: "#e53e3e", fontSize: "13px", textAlign: "center", margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="primary-button"
                style={{ padding: "14px", fontSize: "16px", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}
                disabled={loading}
              >
                {loading ? "UNIENDO..." : "UNIRSE"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/secciones")}
                style={{ padding: "12px", fontSize: "14px", fontWeight: "bold", borderRadius: "8px", cursor: "pointer", background: "#edf2f7", color: "#4a5568", border: "none" }}
              >
                VOLVER A SECCIONES
              </button>
            </form>
          </div>
        </div>

        <Navbar />

      </div>
    </div>
  );
}