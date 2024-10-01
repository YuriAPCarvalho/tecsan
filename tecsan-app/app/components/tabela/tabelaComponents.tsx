import React, { ReactNode, useState } from "react";

export interface Column {
  key: string;
  label: string;
  render?: (item: any) => string | ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  expandable?: boolean;
  renderExpandedContent?: (item: any) => ReactNode;
}

const Tabela: React.FC<TableProps> = ({
  columns,
  data,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  totalItems,
  expandable = false,
  renderExpandedContent,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="p-1 ml-5 mr-5">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600">
            {columns.map((col, index) => (
              <th key={index} className="p-4 border-b">
                {col.label}
              </th>
            ))}
            {expandable && <th className="p-4 border-b"></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={item.id}>
              <tr
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : ""
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-0.5 border-b text-center">
                    {!!col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                {expandable && (
                  <td className="p-2 border-b text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(item.id);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      {expandedRow === item.id ? "Recolher" : "Expandir"}
                    </button>
                  </td>
                )}
              </tr>
              {expandable && expandedRow === item.id && (
                <tr className="bg-gray-200">
                  <td colSpan={columns.length + 1} className="p-4">
                    {renderExpandedContent ? (
                      renderExpandedContent(item)
                    ) : (
                      <div></div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default Tabela;
