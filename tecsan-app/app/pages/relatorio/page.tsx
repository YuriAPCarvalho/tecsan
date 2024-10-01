"use client";
import React, { useEffect, useState } from "react";
import { Form } from "@/app/components/adicionar/form";
import withSidebar from "@/app/components/sidebar/withSidebar";
import type { SaldoProduto } from "@/app/types/SaldoProduto";
import { Estoque } from "@/app/types/Estoque";
import { Fazenda } from "@/app/types/Fazenda";
import { Produto } from "@/app/types/Produto";
import { Categoria } from "@/app/types/Categoria";
import { saldoProdutoService } from "@/services/saldoProduto.service";
import { estoqueService } from "@/services/estoque.service";
import { fazendaService } from "@/services/fazenda.service";
import { produtoService } from "@/services/produto.service";
import { categoriaService } from "@/services/categoria.service";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import { pdf } from "@react-pdf/renderer";
import SaldoProdutoPDF from "./SaldoProdutoPDF";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

const SaldoProduto: React.FC = () => {
  const form = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [saldos, setSaldos] = useState<any[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<any>(null);
  const [selectedFazenda, setSelectedFazenda] = useState<any>(null);
  const [selectedEstoque, setSelectedEstoque] = useState<any>(null);
  const [selectedProduto, setSelectedProduto] = useState<any>(null);

  const fetchCategorias = async () => {
    await categoriaService.getAtivo().then((res) => {
      setCategorias(res.data);
    });
  };

  const fetchFazendas = async () => {
    await fazendaService.getAtivo().then((res) => {
      setFazendas(res.data);
    });
  };

  const fetchEstoques = async () => {
    await estoqueService.getAtivo().then((res) => {
      setEstoques(res.data);
    });
  };

  const fetchProdutos = async () => {
    await produtoService.getAtivo().then((res) => {
      setProdutos(res.data);
    });
  };

  const fetchSaldos = async () => {
    await saldoProdutoService.get().then((res) => {
      setSaldos(res.data);
    });
  };

  const gerarRelatorio = async () => {
    try {
      const blob = await pdf(
        <SaldoProdutoPDF
          saldos={filteredData}
          filters={{
            categoria: selectedCategoria?.label,
            fazenda: selectedFazenda?.label,
            estoque: selectedEstoque?.label,
            produto: selectedProduto?.label,
          }}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio_saldo_estoque.pdf";
      link.click();
    } catch (error) {
      alert("Não foi possível gerar o relatório.");
      console.error(error);
    }
  };

  const limparFiltros = () => {
    setSelectedCategoria(null);
    setSelectedFazenda(null);
    setSelectedEstoque(null);
    setSelectedProduto(null);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCategorias(),
      fetchFazendas(),
      fetchEstoques(),
      fetchProdutos(),
      fetchSaldos(),
    ])
      .catch((error) => {
        message.error(handleErrorException(error));
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      key: "produto",
      label: "Produto",
      render: (item: SaldoProduto) => {
        return item?.produto?.nome;
      },
    },
    {
      key: "categoria",
      label: "Categoria",
      render: (item: SaldoProduto) => {
        return item?.categoria?.nome;
      },
    },

    {
      key: "estoque",
      label: "Estoque",
      render: (item: SaldoProduto) => {
        return item?.estoque?.nome;
      },
    },
    {
      key: "fazenda",
      label: "Fazenda",
      render: (item: SaldoProduto) => {
        return item?.fazenda?.nome;
      },
    },
    {
      key: "saldo",
      label: "Quantidade",
      render: (item: SaldoProduto) => {
        return item?.saldo;
      },
    },
    {
      key: "updatedAt",
      label: "Ultima Atualização",
      render: (item: SaldoProduto) => {
        return <>{new Date(item.updatedAt).toLocaleDateString("pt-BR")}</>;
      },
    },
  ];

  const handleCategoriaChange = (selectedOption: any) => {
    setSelectedCategoria(selectedOption);
  };

  const handleFazendaChange = (selectedOption: any) => {
    setSelectedFazenda(selectedOption);
  };

  const handleEstoqueChange = (selectedOption: any) => {
    setSelectedEstoque(selectedOption);
  };

  const handleProdutoChange = (selectedOption: any) => {
    setSelectedProduto(selectedOption);
  };

  const filteredData = saldos.filter((item) => {
    return (
      (selectedCategoria
        ? item.categoria.nome === selectedCategoria.label
        : true) &&
      (selectedFazenda ? item.fazenda.nome === selectedFazenda.label : true) &&
      (selectedEstoque ? item.estoque.nome === selectedEstoque.label : true) &&
      (selectedProduto ? item.produto.nome === selectedProduto.label : true)
    );
  });

  const categoriaOptions = categorias.map((categoria) => ({
    value: categoria.id,
    label: categoria.nome,
  }));

  const fazendaOptions = fazendas.map((fazenda) => ({
    value: fazenda.id,
    label: fazenda.nome,
  }));

  const estoqueOptions = estoques.map((estoque) => ({
    value: estoque.id,
    label: estoque.nome,
  }));

  const produtoOptions = produtos.map((produto) => ({
    value: produto.id,
    label: produto.nome,
  }));

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      initialFormValues={{}}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <div className="flex flex-col space-y-4 ml-5">
        <h1 className="text-2xl font-bold p-2">Saldo dos Produtos</h1>
        <div className="flex mr-6 items-center space-x-4">
          <div className="flex space-x-4 ml-1 mb-5 flex-grow">
            <Select
              options={categoriaOptions}
              onChange={handleCategoriaChange}
              value={selectedCategoria}
              className="w-72"
              placeholder="Selecione a Categoria"
            />
            <Select
              options={fazendaOptions}
              onChange={handleFazendaChange}
              value={selectedFazenda}
              className="w-72"
              placeholder="Selecione a Fazenda"
            />
            <Select
              options={estoqueOptions}
              onChange={handleEstoqueChange}
              value={selectedEstoque}
              className="w-72"
              placeholder="Selecione o Estoque"
            />
            <Select
              options={produtoOptions}
              onChange={handleProdutoChange}
              value={selectedProduto}
              className="w-72"
              placeholder="Selecione o Produto"
            />
          </div>
          <div className="ml-auto mr-4 flex space-x-4 mb-5">
            <button
              onClick={limparFiltros}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Limpar Filtros
            </button>
            <button
              onClick={gerarRelatorio}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
      <ResourceManager.TableCustom
        data={filteredData}
        columns={columns}
        actions={[]}
      ></ResourceManager.TableCustom>
    </ResourceManager>
  );
};

export default withSidebar(SaldoProduto);
