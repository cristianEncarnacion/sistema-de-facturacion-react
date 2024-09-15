import React from "react";
import styles from "./assets/styles/Layout.module.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export const Layout = ({ children }) => {
  return (
    <div className={styles.gridContainer}>
      {" "}
      {/* Asegúrate de que la clase coincida */}
      <Navbar />
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
