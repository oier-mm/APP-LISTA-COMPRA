import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const login = async () => {
    setError("");

    if (!email || !password) {
      setError(
        "Debes introducir correo y contraseña"
      );
      return;
    }

    try {
      await loginUser(
        email,
        password
      );

      navigate("/secciones");
    } catch (err) {
      setError(
        "Usuario o contraseña incorrectos"
      );
    }
  };

  return (
    <div className="page-container">
      <div className="card">

        <h1>
          🛒 APP LISTA COMPRA
        </h1>

        <input
          className="input"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <button
          className="primary-button"
          onClick={login}
        >
          INICIAR SESIÓN
        </button>

        <button
          className="secondary-button"
          onClick={() =>
            navigate("/registro")
          }
        >
          CREAR CUENTA
        </button>

      </div>
    </div>
  );
}