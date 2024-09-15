import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import styles from "../components/stylesComponents/TableComponent.module.css"; // Asegúrate de que esta ruta sea correcta

const TableComponent = ({ columns, data, onDelete }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className={styles.th}>
              {col.name}
            </th>
          ))}
          <th className={styles.th}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={styles.td}>
                {col.selector(row)}
              </td>
            ))}
            <td className={styles.td}>
              <button
                className={styles.actionsButton}
                onClick={() => onDelete(row.id)}
                aria-label="Eliminar"
              >
                <FontAwesomeIcon className={styles.icon} icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
