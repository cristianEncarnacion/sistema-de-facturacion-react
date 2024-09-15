import React, { useState, useEffect } from "react";
import { Layout } from "../Layout";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client"; // Asegúrate de tener configurado supabase correctamente

const columns = [
  { name: "Cliente", selector: (row) => row.cliente },
  { name: "Producto", selector: (row) => row.producto },
  { name: "Código", selector: (row) => row.codigo },
  { name: "Cantidad", selector: (row) => row.cantidad },
  { name: "Precio", selector: (row) => row.precio },
  { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleString() }, // Formatear la fecha
  { name: "Total Facturado", selector: (row) => row.total_facturado },
  { name: "Método de Pago", selector: (row) => row.metodo_pago }, // Añadido Método de Pago
];

const Contabilidad = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.rpc("get_facturas");
        if (error) {
          throw error;
        }
        setData(data);
        setFilteredData(data); // Inicializa el estado de datos filtrados con todos los datos
      } catch (error) {
        console.error("Error al obtener los datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("ventas").delete().eq("id", id);
      if (error) throw error;

      // Actualiza el estado después de eliminar
      setData(data.filter((item) => item.id !== id));
      setFilteredData(filteredData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el dato", error);
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar factura"
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

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TableComponent
          columns={columns}
          data={filteredData}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
};

export default Contabilidad;
