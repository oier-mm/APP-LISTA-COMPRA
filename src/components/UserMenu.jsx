import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logoutUser } from "../services/authService";

export default function UserMenu() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [initial, setInitial] = useState("👤");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        setUserEmail(currentUser.email);
        setInitial(currentUser.email.charAt(0).toUpperCase());
      } else {
        setUserEmail("");
        setInitial("👤");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="user-menu card" style={{ padding: "16px", minWidth: "220px", textAlign: "center" }}>
      {/* Círculo con la inicial */}
      <div style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#2f855a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "bold",
        margin: "0 auto 8px auto"
      }}>
        {initial}
      </div>

      {/* Correo o nombre del usuario */}
      <p style={{ fontSize: "12px", color: "#718096", marginBottom: "12px", wordBreak: "break-all" }}>
        {userEmail || "Usuario"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/perfil")}
          style={{ width: "100%", padding: "10px" }}
        >
          Mi Perfil
        </button>

        <button
          type="button"
          className="secondary-button"
          style={{ width: "100%", padding: "10px" }}
        >
          Cambiar contraseña
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleLogout}
          style={{ width: "100%", padding: "10px", backgroundColor: "#e53e3e" }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}