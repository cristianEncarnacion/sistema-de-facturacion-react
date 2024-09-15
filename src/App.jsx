import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./paginas/Inicio";
import { Factura } from "./paginas/Factura";
import Inventario from "./paginas/Inventario"; // Importación sin llaves, ya que es exportación por defecto
import Contabilidad from "./paginas/Contabilidad";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import AgregarFactura from "./paginas/AgregarFactura";
import PrivateRoute from "./PrivateRoute";
import { Cliente } from "./paginas/Cliente";
import Proveedor from "./paginas/Proveedor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<PrivateRoute element={<Inicio />} />} />
        <Route
          path="/cliente"
          element={<PrivateRoute element={<Cliente />} />}
        />
        <Route
          path="/factura"
          element={<PrivateRoute element={<Factura />} />}
        />
        <Route
          path="/inventario"
          element={<PrivateRoute element={<Inventario />} />}
        />
        <Route
          path="/proveedor"
          element={<PrivateRoute element={<Proveedor />} />}
        />
        <Route
          path="/contabilidad"
          element={<PrivateRoute element={<Contabilidad />} />}
        />
        <Route
          path="/nuevaFactura"
          element={<PrivateRoute element={<AgregarFactura />} />}
        />
        {/* Agrega otras rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
