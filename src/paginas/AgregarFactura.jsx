import React, { useState, useEffect } from "react";
import { Layout } from "../Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";

const columns = [
  { name: "Cliente", selector: (row) => row.cliente },
  { name: "Producto", selector: (row) => row.producto_nombre }, // Cambiado aquí
  { name: "Código", selector: (row) => row.codigo },
  { name: "Cantidad", selector: (row) => row.cantidad },
  { name: "Precio Total", selector: (row) => row.precio_total },
  { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleString() },
  { name: "Método de Pago", selector: (row) => row.metodo_pago },
];

const AgregarFactura = () => {
  const [data, setData] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [values, setValues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const { data: productosData, error: productosError } = await supabase
          .from("productos")
          .select("*")
          .gt("cantidad", 0);

        if (productosError) {
          console.error("Error fetching productos:", productosError.message);
        } else {
          setProductos(productosData);
        }

        // Obtener clientes
        const { data: clientesData, error: clientesError } = await supabase
          .from("clientes")
          .select("*");

        if (clientesError) {
          console.error("Error fetching clientes:", clientesError.message);
        } else {
          setClientes(clientesData);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProductPrice = async () => {
      if (values.producto) {
        const { data: productoData, error: productoError } = await supabase
          .from("productos")
          .select("precio_venta, producto")
          .eq("id", values.producto)
          .single();

        if (productoError) {
          console.error("Error fetching product price:", productoError.message);
        } else {
          setPrecioUnitario(productoData.precio_venta);
          setValues((prevValues) => ({
            ...prevValues,
            precio: productoData.precio_venta,
            producto_nombre: productoData.producto, // Guardar nombre del producto
          }));
        }
      } else {
        setPrecioUnitario("");
        setValues((prevValues) => ({
          ...prevValues,
          precio: "",
          producto_nombre: "",
        }));
      }
    };

    fetchProductPrice();
  }, [values.producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (values) => {
    const { cliente, producto, codigo, cantidad, precio, fecha, metodo_pago } =
      values;

    if (
      !cliente ||
      !producto ||
      !codigo ||
      !cantidad ||
      !precio ||
      !fecha ||
      !metodo_pago
    ) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    const precioTotal = cantidad * precio;

    try {
      // Verificar cantidad en inventario
      const { data: productoData, error: productoError } = await supabase
        .from("productos")
        .select("cantidad")
        .eq("id", producto)
        .single();

      if (productoError || productoData.cantidad < cantidad) {
        setErrorMessage("Cantidad insuficiente en inventario.");
        return;
      }

      // Insertar factura
      const { error: insertError } = await supabase.from("ventas").insert([
        {
          cliente: cliente,
          producto: producto,
          codigo: codigo,
          cantidad: cantidad,
          precio: precioTotal,
          fecha: fecha,
          metodo_pago: metodo_pago,
        },
      ]);

      if (insertError) {
        console.error("Error inserting data:", insertError.message);
        setErrorMessage("Error al insertar los datos.");
      } else {
        // Actualizar inventario
        const nuevaCantidad = productoData.cantidad - cantidad;
        const { error: updateError } = await supabase
          .from("productos")
          .update({ cantidad: nuevaCantidad })
          .eq("id", producto);

        if (updateError) {
          console.error("Error updating inventory:", updateError.message);
          setErrorMessage("Error al actualizar el inventario.");
        } else {
          // Obtener el nombre del producto para mostrarlo en la tabla
          const { data: productoData, error: productoError } = await supabase
            .from("productos")
            .select("producto")
            .eq("id", producto)
            .single();

          if (productoError) {
            console.error(
              "Error fetching product name:",
              productoError.message
            );
            setErrorMessage("Error al obtener el nombre del producto.");
            return;
          }

          setData((prevData) => [
            ...prevData,
            {
              ...values,
              precio_total: precioTotal,
              metodo_pago: metodo_pago,
              producto_nombre: productoData.producto, // Agregar nombre del producto
            },
          ]);
          setErrorMessage("");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setErrorMessage("Error inesperado.");
    }
  };

  const fields = [
    {
      name: "cliente",
      label: "Cliente",
      type: "select",
      options: clientes.map((cliente) => ({
        label: cliente.nombre,
        value: cliente.id,
      })),
      placeholder: "Seleccione un cliente",
    },
    {
      name: "producto",
      label: "Producto",
      type: "select",
      options: productos.map((producto) => ({
        label: `${producto.producto} (Código: ${producto.codigo})`,
        value: producto.id,
      })),
      placeholder: "Seleccione un producto",
    },
    {
      name: "codigo",
      label: "Código",
      type: "text",
      placeholder: "Ingrese el código del producto",
    },
    {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      placeholder: "Ingrese la cantidad",
    },
    {
      name: "precio",
      label: "Precio Unitario",
      type: "number",
      value: precioUnitario,
      placeholder: "Ingrese el precio unitario",
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
    },
    {
      name: "metodo_pago",
      label: "Método de Pago",
      type: "select",
      options: [
        { label: "Efectivo", value: "Efectivo" },
        { label: "Transferencia", value: "Transferencia" },
        { label: "Tarjeta", value: "Tarjeta" },
      ],
      placeholder: "Seleccione un método de pago",
    },
  ];

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.rpc("delete_venta", { id });

      if (error) {
        throw error;
      }

      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar la factura", error);
    }
  };

  return (
    <Layout>
      <FormularioGenerico
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={values}
        onChange={handleChange}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <TableComponent columns={columns} data={data} onDelete={handleDelete} />
    </Layout>
  );
};

export default AgregarFactura;
