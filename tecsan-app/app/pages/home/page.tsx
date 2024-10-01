"use client";
import React, { useState, useEffect } from "react";
import withSidebar from "@/app/components/sidebar/withSidebar";
import {
  DocumentTextIcon,
  UserIcon,
  TagIcon,
  ArchiveBoxIcon,
  HomeModernIcon,
  DocumentPlusIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  DocumentMinusIcon,
} from "@heroicons/react/20/solid";
import Cookies from "js-cookie";

const shortcuts = [
  { label: "Usuário", icon: UserIcon, href: "/pages/usuario" },
  { label: "Categoria", icon: TagIcon, href: "/pages/categoria" },
  { label: "Produto", icon: DocumentTextIcon, href: "/pages/produto" },
  { label: "Fazenda", icon: HomeModernIcon, href: "/pages/fazenda" },
  { label: "Estoque", icon: ArchiveBoxIcon, href: "/pages/estoque" },
  {
    label: "Entrada de Produto",
    icon: DocumentPlusIcon,
    href: "/pages/entrada",
  },
  { label: "Saída de Produto", icon: DocumentMinusIcon, href: "/pages/saida" },
  {
    label: "Transferência de Produto",
    icon: ArrowPathIcon,
    href: "/pages/transferencia",
  },
  {
    label: "Saldo dos Produtos",
    icon: DocumentChartBarIcon,
    href: "/pages/relatorio",
  },
];

function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = Cookies.get("nome") || null;
      setUserName(storedUserName);

      const intervalId = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="mb-8 text-center">
        {userName && (
          <h1 className="text-2xl font-bold">Bem-vindo, {userName}!</h1>
        )}
        {currentDateTime && (
          <p className="text-gray-600">{currentDateTime.toLocaleString()}</p>
        )}
      </div>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full h-full">
        {shortcuts.map((shortcut, index) => (
          <a
            key={index}
            href={shortcut.href}
            className="flex flex-col items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-600 p-4"
          >
            <shortcut.icon className="w-12 h-12 mb-2" />
            <span className="text-lg font-semibold">{shortcut.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default withSidebar(Home);
