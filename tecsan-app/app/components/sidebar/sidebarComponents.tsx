"use client";
import React, { useState } from "react";

import {
  HomeIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  UserIcon,
  TagIcon,
  ArchiveBoxIcon,
  HomeModernIcon,
  TableCellsIcon,
  DocumentPlusIcon,
  DocumentMinusIcon,
  ArrowPathIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/20/solid";
import LogoutButton from "../login/logoutComponents";

const Sidebar: React.FC = () => {
  const [isCadastroOpen, setCadastroOpen] = useState(false);
  const [isProdutoOpen, setProdutoOpen] = useState(false);
  const [isRelatorioOpen, setRelatorioOpen] = useState(false);

  const toggleCadastro = () => {
    setCadastroOpen(!isCadastroOpen);
  };

  const toggleProduto = () => {
    setProdutoOpen(!isProdutoOpen);
  };

  const toggleRelatorio = () => {
    setRelatorioOpen(!isRelatorioOpen);
  };

  return (
    <div className="h-screen bg-gray-800 text-white" style={{ width: "15%" }}>
      <div className="p-4 ml-4 flex items-center">
        <img src="/images/icon.png" alt="Logo" className="w-11 h-11 mr-2" />
        <span className="text-lg font-bold">STOK - Inventário</span>
      </div>
      <hr className="mt-4 border-gray-300 w-full" />
      <ul className="mt-2">
        <li className="hover:bg-gray-700 ml-4">
          <a href="/pages/home" className="flex items-center p-4">
            <HomeIcon className="w-5 h-5 mr-3" />
            Início
          </a>
        </li>
        <li className=" ml-4">
          <a
            href="#"
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={toggleCadastro}
          >
            <PlusCircleIcon className="w-5 h-5 mr-3" />
            Cadastro
            <ChevronDownIcon className="w-4 h-4 ml-auto" />
          </a>
          {isCadastroOpen && (
            <ul className="pl-6 mt-2">
              <li className="hover:bg-gray-600">
                <a href="/pages/usuario" className="flex items-center p-4 ml-4">
                  <UserIcon className="w-5 h-5 mr-3" />
                  Usuário
                </a>
              </li>
              <li className="hover:bg-gray-600">
                <a
                  href="/pages/categoria"
                  className="flex items-center p-4 ml-4"
                >
                  <TagIcon className="w-5 h-5 mr-3" />
                  Categoria
                </a>
              </li>
              <li className="hover:bg-gray-600">
                <a href="/pages/produto" className="flex items-center p-4 ml-4">
                  <DocumentTextIcon className="w-5 h-5 mr-3" />
                  Produto
                </a>
              </li>
              <li className="hover:bg-gray-600">
                <a href="/pages/fazenda" className="flex items-center p-4 ml-4">
                  <HomeModernIcon className="w-5 h-5 mr-3" />
                  Fazenda
                </a>
              </li>
              <li className="hover:bg-gray-600">
                <a href="/pages/estoque" className="flex items-center p-4 ml-4">
                  <ArchiveBoxIcon className="w-5 h-5 mr-3" />
                  Estoque
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className=" ml-4">
          <a
            href="#"
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={toggleProduto}
          >
            <TruckIcon className="w-5 h-5 mr-3" />
            Produto
            <ChevronDownIcon className="w-4 h-4 ml-auto" />
          </a>
          {isProdutoOpen && (
            <ul className="pl-6 mt-2">
              <li className="hover:bg-gray-600 ml-4">
                <a href="/pages/entrada" className="flex items-center p-4">
                  <DocumentPlusIcon className="w-5 h-5 mr-3" />
                  Entrada de Produto
                </a>
              </li>
              <li className="hover:bg-gray-600 ml-4">
                <a href="/pages/saida" className="flex items-center p-4">
                  <DocumentMinusIcon className="w-5 h-5 mr-3" />
                  Saida de Produto
                </a>
              </li>
              <li className="hover:bg-gray-600 ml-4">
                <a
                  href="/pages/transferencia"
                  className="flex items-center p-4"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-3" />
                  Transferências
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="hover:bg-gray-600 ml-4">
          <a href="/pages/inventario" className="flex items-center p-4">
            <ClipboardDocumentListIcon className="w-5 h-5 mr-3" />
            Inventário
          </a>
        </li>
        <li className=" ml-4">
          <a
            href="#"
            className="flex items-center p-4 hover:bg-gray-700"
            onClick={toggleRelatorio}
          >
            <DocumentChartBarIcon className="w-5 h-5 mr-3" />
            Relatórios
            <ChevronDownIcon className="w-4 h-4 ml-auto" />
          </a>
          {isRelatorioOpen && (
            <ul className="pl-6 mt-2">
              <li className="hover:bg-gray-600 ml-4">
                <a href="/pages/relatorio" className="flex items-center p-4">
                  <TableCellsIcon className="w-5 h-5 mr-3" />
                  Saldo dos produtos
                </a>
              </li>
            </ul>
          )}
        </li>
        <LogoutButton />
      </ul>
    </div>
  );
};

export default Sidebar;
