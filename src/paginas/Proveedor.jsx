import React, { useState, useEffect } from "react";
import { Layout } from "../Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";

const columns = [
  { name: "Nombre", selector: (row) => row.nombre },
  { name: "Correo", selector: (row) => row.correo },
  { name: "Teléfono", selector: (row) => row.telefono },
  { name: "Dirección", selector: (row) => row.direccion },
];

const Proveedor = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: proveedorData, error: proveedorError } = await supabase
          .from("proveedores")
          .select("*");
        if (proveedorError) {
          console.error("Error fetching proveedores:", proveedorError.message);
        } else {
          setData(proveedorData);
          setFilteredData(proveedorData); // Inicializa el estado de datos filtrados con todos los datos
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSubmit = async (values) => {
    try {
      const { data: existingProveedores, error: checkError } = await supabase
        .from("proveedores")
        .select("*")
        .eq("correo", values.correo);

      if (checkError) {
        console.error(
          "Error checking existing proveedores:",
          checkError.message
        );
        setError("Error checking existing proveedores.");
        return;
      }

      if (existingProveedores.length > 0) {
        setError(
          "El correo electrónico ya está registrado. Por favor, elija otro correo."
        );
        return;
      }

      const { error: insertError } = await supabase
        .from("proveedores")
        .insert([values]);
      if (insertError) {
        console.error("Error inserting data:", insertError.message);
        setError("Error inserting data.");
      } else {
        setData((prevData) => [...prevData, values]);
        setFilteredData((prevData) => [...prevData, values]); // Actualiza los datos filtrados
        setError(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setError("Unexpected error.");
    }
  };

  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      placeholder: "Ingrese el nombre",
      className: "nombre",
    },
    {
      name: "correo",
      label: "Correo",
      type: "email",
      placeholder: "Ingrese el correo electrónico",
      className: "correo",
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "text",
      placeholder: "Ingrese el teléfono",
      className: "telefono",
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      placeholder: "Ingrese la dirección",
      className: "direccion",
    },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar proveedor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FormularioGenerico
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={{}}
      />
      <TableComponent columns={columns} data={filteredData} />
    </Layout>
  );
};

export default Proveedor;
