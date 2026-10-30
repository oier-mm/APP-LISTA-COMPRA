import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] =
    useState("");

  const [error, setError] = useState("");

  const register = async () => {
    setError("");

    if (
      !email ||
      !password ||
      !repeatPassword
    ) {
      setError(
        "Todos los campos son obligatorios"
      );
      return;
    }

    if (password !== repeatPassword) {
      setError(
        "Las contraseñas no coinciden"
      );
      return;
    }

    try {
      await registerUser(
        email,
        password
      );

      alert(
        "Cuenta creada correctamente"
      );

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="card">

        <h1>Crear Cuenta</h1>

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

        <input
          className="input"
          type="password"
          placeholder="Repetir contraseña"
          value={repeatPassword}
          onChange={(e) =>
            setRepeatPassword(
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
          onClick={register}
        >
          CREAR CUENTA
        </button>

        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← VOLVER
        </button>

      </div>
    </div>
  );
}