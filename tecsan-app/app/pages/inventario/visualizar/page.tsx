"use client";
import React, { useState } from "react";
import type { ItensInventario } from "@/app/types/ItensInventario";
import { itensInventarios } from "@/app/data/dadosItensInvetarios";
import withSidebar from "@/app/components/sidebar/withSidebar";

const ItensInventario: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const filteredData = itensInventarios.filter((item) =>
    item.produto.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Cadastro de Categorias</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600">
            <th className="p-4 border-b">ID</th>
            <th className="p-4 border-b">Produto</th>
            <th className="p-4 border-b">Saldo atual</th>
            <th className="p-4 border-b">Nova Contagem</th>
            <th className="p-4 border-b">Usuário Contagem</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : ""
              }`}
            >
              <td className="p-4 border-b text-center">{item.id}</td>
              <td className="p-4 border-b text-center">{item.produto}</td>
              <td className="p-4 border-b text-center">{item.saldoAtual}</td>
              <td className="p-4 border-b text-center">{item.novaContagem}</td>
              <td className="p-4 border-b text-center">
                {item.usuarioSistema}
              </td>
            </tr>
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

export default withSidebar(ItensInventario);
