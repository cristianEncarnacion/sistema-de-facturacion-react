import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/stylesComponents/Login.module.css";
import { supabase } from "../DataBase/Client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const checkUser = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Credenciales incorrectas");
      console.log(error.message);
      return;
    }

    if (data?.session?.user) {
      navigate("/inicio");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkUser();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Bienvenido</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Iniciar Sesión
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.footer}>
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="/registro">¿No tienes cuenta? Regístrate</a>
        </div>
      </div>
      <div className={styles.back}>
        <a href="/registro">Volver</a>
      </div>
    </div>
  );
};

export default Login;
