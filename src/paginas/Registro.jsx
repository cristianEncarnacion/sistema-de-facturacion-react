import React, { useState } from "react";
import styles from "../components/stylesComponents/Login.module.css";
import { supabase } from "../DataBase/Client";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (email === "" || password === "" || confirmpassword === "") {
      setError("Por favor, rellene todos los campos");
      return;
    } else if (password !== confirmpassword) {
      setError("Las contraseñas no coinciden");
      return;
    } else {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) {
          setError("Error al registrar: " + error.message);
          return;
        }

        const user = data.user;

        if (user) {
          const { data: insertData, error: insertError } = await supabase
            .from("usuarios")
            .insert([{ user_id: user.id, email: email, password: password }]);

          if (insertError) {
            setError(
              "Error al guardar en la base de datos: " + insertError.message
            );
            return;
          }

          alert(
            "Registro exitoso. Por favor, revisa tu correo para confirmar tu cuenta."
          );
          setEmail("");
          setPassword("");
          setConfirmpassword("");

          navigate("/");
        } else {
          setError("Registro fallido, el usuario no se creó correctamente.");
        }
      } catch (error) {
        setError("Error al registrar: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Regístrate</h2>
        <form className={styles.form} onSubmit={handleRegistro}>
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
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Registrar
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.footer}>
          <a href="/">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
      <div className={styles.back}>
        <a href="/">Volver</a>
      </div>
    </div>
  );
};

export default Registro;
