import React, { useState, useEffect } from "react";
import { Layout } from "../Layout";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client"; // Importa la configuración de Supabase

const columns = [
  { name: "Cliente", selector: (row) => row.cliente },
  { name: "Producto", selector: (row) => row.producto },
  { name: "Código", selector: (row) => row.codigo },
  { name: "Cantidad", selector: (row) => row.cantidad },
  { name: "Precio", selector: (row) => row.precio },
  { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleString() }, // Formatear la fecha
  { name: "Total Facturado", selector: (row) => row.total_facturado },
  { name: "Método de Pago", selector: (row) => row.metodo_pago }, // Nueva columna
];

export const Factura = () => {
  const [listaForm, setListaForm] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const { data, error } = await supabase.rpc("get_facturas");
        if (error) {
          throw error;
        }
        setListaForm(data);
        setFilteredData(data); // Inicializa el estado de datos filtrados con todos los datos
      } catch (error) {
        console.error("Error al obtener las facturas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const handleSearch = () => {
    // Filtrar los datos locales basados en el término de búsqueda
    const filtered = listaForm.filter(
      (item) =>
        item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const { data, error } = await supabase.rpc("delete", {
        p_id: parseInt(id, 10), // Asegúrate de que id es un número entero
      });

      if (error) {
        console.error("Error al eliminar la factura:", error.message);
      } else {
        console.log("Factura eliminada correctamente:", data);
        // Actualiza la lista de facturas después de eliminar
        const updatedList = listaForm.filter((item) => item.id !== id);
        setListaForm(updatedList);
        setFilteredData(updatedList); // Actualizar los datos filtrados
      }
    } catch (error) {
      console.error("Error al eliminar la factura", error.message);
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap", // Ajusta los elementos cuando el espacio sea pequeño
        }}
      >
        <button
          style={{
            fontSize: "14px",
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px", // Agrega margen para pantallas más pequeñas
          }}
        >
          <a href="/nuevaFactura" className="btn btn-primary">
            Agregar Factura
          </a>
        </button>
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
              width: "100%", // Para pantallas pequeñas toma el 100% del espacio disponible
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
              width: "100%", // Ajusta el botón a pantallas pequeñas
              marginTop: "10px", // Un poco de margen superior en pantallas pequeñas
            }}
          >
            Buscar
          </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TableComponent
          columns={columns}
          data={filteredData}
          onDelete={handleDelete}
          pagination={true}
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
        />
      )}
    </Layout>
  );
};
