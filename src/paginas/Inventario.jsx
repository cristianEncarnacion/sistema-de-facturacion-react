import React, { useState, useEffect } from "react";
import { Layout } from "../Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";

const columns = [
  { name: "Producto", selector: (row) => row.producto || "" },
  { name: "Código", selector: (row) => row.codigo },
  { name: "Cantidad", selector: (row) => row.cantidad },
  { name: "Precio de compra", selector: (row) => row.precio_compra },
  { name: "Precio de venta", selector: (row) => row.precio_venta },
  { name: "Proveedor", selector: (row) => row.proveedor },
];

const Inventario = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: inventarioData, error: inventarioError } = await supabase
          .from("productos")
          .select("*");
        if (inventarioError) {
          console.error("Error fetching inventario:", inventarioError.message);
        } else {
          setData(inventarioData);
          setFilteredData(inventarioData); // Inicializa el estado de datos filtrados con todos los datos
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
        item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSubmit = async (values) => {
    try {
      const { data: existingProducts, error: checkError } = await supabase
        .from("productos")
        .select("*")
        .eq("codigo", values.codigo);

      if (checkError) {
        console.error("Error checking existing products:", checkError.message);
        setError("Error checking existing products.");
        return;
      }

      if (existingProducts.length > 0) {
        setError(
          "El código del producto ya existe. Por favor, elija otro código."
        );
        return;
      }

      const { error: insertError } = await supabase
        .from("productos")
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
      name: "producto",
      label: "Producto",
      type: "text",
      placeholder: "Ingrese el nombre del producto",
      className: "producto",
    },
    {
      name: "codigo",
      label: "Código",
      type: "text",
      placeholder: "Ingrese el código",
      className: "codigo",
    },
    {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      placeholder: "Ingrese la cantidad",
      className: "cantidad",
    },
    {
      name: "precio_compra",
      label: "Precio de compra",
      type: "number",
      placeholder: "Ingrese el precio de compra",
      className: "precio",
    },
    {
      name: "precio_venta",
      label: "Precio de venta",
      type: "number",
      placeholder: "Ingrese el precio de venta",
      className: "precio",
    },
    {
      name: "proveedor",
      label: "Proveedor",
      type: "text",
      placeholder: "Ingrese el nombre del proveedor",
      className: "proveedor",
    },
  ];

  const handleDelete = async (id) => {
    try {
      const { data: deletedData, error: deleteError } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error deleting data:", deleteError.message);
        setError("Error deleting data.");
      } else {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        setError(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setError("Unexpected error.");
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar producto"
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
      <TableComponent
        columns={columns}
        data={filteredData}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default Inventario;
