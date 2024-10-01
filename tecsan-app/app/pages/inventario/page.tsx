"use client";
import React, { useEffect, useState } from "react";
import { Form } from "@/app/components/adicionar/form";
import withSidebar from "@/app/components/sidebar/withSidebar";
import type { SaldoProduto } from "@/app/types/SaldoProduto";
import { Estoque } from "@/app/types/Estoque";
import { Fazenda } from "@/app/types/Fazenda";
import { Produto } from "@/app/types/Produto";
import { saldoProdutoService } from "@/services/saldoProduto.service";
import { estoqueService } from "@/services/estoque.service";
import { fazendaService } from "@/services/fazenda.service";
import { produtoService } from "@/services/produto.service";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import dynamic from "next/dynamic";
import { inventarioService } from "@/services/inventario.service";
import Cookies from "js-cookie";
import { Inventario } from "@/app/types/Inventario";
import { Usuario } from "@/app/types/Usuario";
const Select = dynamic(() => import("react-select"), { ssr: false });

const SaldoProduto: React.FC = () => {
  const form = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [inventarios, setInvetarios] = useState<Inventario[]>([]);
  const [saldos, setSaldos] = useState<any[]>([]);
  const [selectedFazenda, setSelectedFazenda] = useState<any>(null);
  const [selectedEstoque, setSelectedEstoque] = useState<any>(null);
  const [selectedProduto, setSelectedProduto] = useState<any>(null);
  const [saldosAtualizados, setSaldosAtualizados] = useState<
    Record<string, number>
  >({});

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

  const fetchInvetarios = async () => {
    await inventarioService.get().then((res) => {
      setInvetarios(res.data);
    });
  };

  const fetchSaldos = async () => {
    await saldoProdutoService.get().then((res) => {
      setSaldos(res.data);
    });
  };

  const handleSaldoChange = (saldo: SaldoProduto, value: string) => {
    if (!value) {
      setSaldosAtualizados((prev) => {
        const updatedSaldos = { ...prev };
        delete updatedSaldos[JSON.stringify(saldo)];
        return updatedSaldos;
      });
    } else {
      setSaldosAtualizados((prev) => ({
        ...prev,
        [JSON.stringify(saldo)]: Number(value),
      }));
    }
  };
  const registrarInventario = async () => {
    try {
      setLoading(true);
      const userId = Cookies.get("id") ?? "";
      let usuarioId = parseInt(userId);

      const inventariosParaRegistrar = Object.entries(saldosAtualizados).map(
        ([saldoJsonString, novaQuantidade]) => {
          let saldo: SaldoProduto = JSON.parse(saldoJsonString);
          let formatedValues = {
            quantidadeAnterior: Number(saldo.saldo) || 0,
            quantidadeAtual: novaQuantidade,
            produtoId: saldo.produtoId,
            fazendaId: saldo.fazendaId,
            estoqueId: saldo.estoqueId,
            usuarioId,
          };

          return formatedValues;
        }
      );

      if (inventariosParaRegistrar && inventariosParaRegistrar.length === 0) {
        message.error(
          "É necessário alterar algum saldo na tabela para registrar um inventário!"
        );
        return;
      }

      await inventarioService.post(inventariosParaRegistrar);
      message.success("Inventários registrados com sucesso!");

      setSaldos((prevSaldos) =>
        prevSaldos.map((saldo) => {
          const atualizado = inventariosParaRegistrar.find(
            (inv) =>
              inv.produtoId === saldo.produtoId &&
              inv.fazendaId === saldo.fazendaId &&
              inv.estoqueId === saldo.estoqueId
          );
          if (atualizado) {
            return { ...saldo, saldo: atualizado.quantidadeAtual };
          }
          return saldo;
        })
      );

      setSaldosAtualizados({});
    } catch (error) {
      message.error(handleErrorException(error));
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setSelectedFazenda(null);
    setSelectedEstoque(null);
    setSelectedProduto(null);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      let formatedValues;
      const userId = Cookies.get("id") ?? "";
      let usuarioId = parseInt(userId);
      formatedValues = {
        quantidadeAnterior: Number(values.saldo) || 0,
        quantidadeAtual: Number(values.quantidadeAtual) || 0,
        produtoId: values.produtoId,
        fazendaId: values.fazendaId,
        estoqueId: values.estoqueId,
        usuarioId,
      };

      await inventarioService.post(values);
      setModalOpen(false);
      setSaldosAtualizados({});
      await fetchInvetarios();
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFazendas(),
      fetchEstoques(),
      fetchProdutos(),
      fetchSaldos(),
      fetchInvetarios(),
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
      label: "Saldo",
      render: (item: SaldoProduto) => {
        return item?.saldo;
      },
    },
    {
      key: "quantidadeAtual",
      label: "Novo Saldo",
      render: (item: SaldoProduto) => {
        return (
          <input
            type="number"
            className="px-1 border rounded "
            placeholder="Insira o novo saldo"
            defaultValue={undefined}
            min={0}
            onChange={(e) => handleSaldoChange(item, e.target.value)}
          />
        );
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

  const handleFazendaChange = (selectedOption: any) => {
    setSelectedFazenda(selectedOption);
  };

  const handleEstoqueChange = (selectedOption: any) => {
    setSelectedEstoque(selectedOption);
  };

  const handleProdutoChange = (selectedOption: any) => {
    setSelectedProduto(selectedOption);
  };

  const handleEditClick = (saldo: SaldoProduto) => {
    form.setFormValues(saldo);
    form.setErrors({});

    setModalOpen(true);
  };

  const filteredData = saldos.filter((item) => {
    return (
      (selectedFazenda ? item.fazenda.nome === selectedFazenda.label : true) &&
      (selectedEstoque ? item.estoque.nome === selectedEstoque.label : true) &&
      (selectedProduto ? item.produto.nome === selectedProduto.label : true)
    );
  });

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
        <h1 className="text-2xl font-bold p-2">Inventário</h1>
        <div className="flex mr-6 items-center space-x-4">
          <div className="flex space-x-4 ml-1 mb-5 flex-grow">
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
              onClick={() => {
                registrarInventario();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Registrar Inventário
            </button>
          </div>
        </div>
      </div>

      <ResourceManager.TableCustom
        data={filteredData}
        columns={columns}
        expandable={true}
        actions={[]}
        renderExpandedContent={(item: SaldoProduto) => {
          const sortedInventarios = inventarios
            .filter((i) => i.produtoId === item.produtoId)
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );

          return (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Inventários Realizados</h3>
              <ul className="list-none pl-5 space-y-2">
                {sortedInventarios?.map((inventario, index) => (
                  <li
                    key={inventario.produtoId + index}
                    className="border-b pb-2"
                  >
                    <div className="flex gap-16">
                      <div className="text-sm text-gray-600">
                        Saldo Anterior:
                        <div>
                          <span className="font-medium">
                            {inventario.quantidadeAnterior}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Novo Saldo:
                        <div>
                          <span className="font-medium">
                            {inventario.quantidadeAtual}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Data:
                        <div>
                          {new Date(inventario.updatedAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Usuário:
                        <div>{inventario?.usuario?.nome}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        }}
      ></ResourceManager.TableCustom>
    </ResourceManager>
  );
};

export default withSidebar(SaldoProduto);
