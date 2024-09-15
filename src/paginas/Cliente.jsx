import React, { useState, useEffect } from "react";
import { Layout } from "../Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";

// Define las columnas para la tabla
const columns = [
  { name: "Nombre", selector: (row) => row.nombre },
  { name: "Email", selector: (row) => row.email },
  { name: "Teléfono", selector: (row) => row.telefono },
  { name: "Dirección", selector: (row) => row.direccion },
];

// Componente Cliente
export const Cliente = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formValues, setFormValues] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar datos desde Supabase al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("clientes").select("*");
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setData(data);
          setFilteredData(data); // Inicializa los datos filtrados
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };
    fetchData();
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (values) => {
    const { nombre, email, telefono, direccion } = values;

    if (!nombre || !email || !telefono || !direccion) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const { error } = await supabase
        .from("clientes")
        .insert([{ nombre, email, telefono, direccion }]);
      if (error) {
        console.error("Error inserting data:", error.message);
      } else {
        const newClient = { nombre, email, telefono, direccion };
        setData([...data, newClient]);
        setFilteredData([...data, newClient]);
        setFormValues({
          nombre: "",
          email: "",
          telefono: "",
          direccion: "",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };

  // Maneja la búsqueda de clientes
  const handleSearch = () => {
    const searchLower = (searchTerm || "").toLowerCase();
    const filtered = data.filter((item) => {
      const nombre = item.nombre ? item.nombre.toLowerCase() : "";
      const email = item.email ? item.email.toLowerCase() : "";
      const telefono = item.telefono ? item.telefono.toLowerCase() : "";
      const direccion = item.direccion ? item.direccion.toLowerCase() : "";

      return (
        nombre.includes(searchLower) ||
        email.includes(searchLower) ||
        telefono.includes(searchLower) ||
        direccion.includes(searchLower)
      );
    });
    setFilteredData(filtered);
  };

  // Define los campos del formulario
  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      placeholder: "Ingrese el nombre del cliente",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Ingrese el email del cliente",
      type: "email",
    },
    {
      name: "telefono",
      label: "Teléfono",
      placeholder: "Ingrese el teléfono del cliente",
      type: "text",
    },
    {
      name: "direccion",
      label: "Dirección",
      placeholder: "Ingrese la dirección del cliente",
      type: "text",
    },
  ];

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("clientes").delete().match({ id });
      if (error) {
        console.error("Error deleting data:", error.message);
      } else {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        setFilteredData(newData);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };
  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar cliente"
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
      <FormularioGenerico
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={formValues}
      />
      <TableComponent
        columns={columns}
        data={filteredData}
        onDelete={handleDelete}
      />
    </Layout>
  );
};
