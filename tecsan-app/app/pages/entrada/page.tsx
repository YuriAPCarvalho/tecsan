"use client";
import React, { useEffect, useState } from "react";
import { Form } from "@/app/components/adicionar/form";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import withSidebar from "@/app/components/sidebar/withSidebar";
import { FieldConfig } from "@/app/components/adicionar/formulario";
import { fazendaService } from "@/services/fazenda.service";
import { estoqueService } from "@/services/estoque.service";
import { produtoService } from "@/services/produto.service";
import { entradaService } from "@/services/entrada.service";
import { usuarioService } from "@/services/usuario.service";
import type { Entrada } from "@/app/types/Entrada";
import { Estoque } from "@/app/types/Estoque";
import { Fazenda } from "@/app/types/Fazenda";
import { Produto } from "@/app/types/Produto";
import { Usuario } from "@/app/types/Usuario";
import Cookie from "js-cookie";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";

const Entrada: React.FC = () => {
  const form = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entradas, setEntradas] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredEstoques, setFilteredEstoques] = useState<Estoque[]>([]);

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

  const fetchEntradas = async () => {
    await entradaService.get().then((res) => {
      setEntradas(res.data);
    });
  };

  const fetchUsuarios = async () => {
    await usuarioService.getAtivo().then((res) => {
      setUsuarios(res.data);
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFazendas(),
      fetchEstoques(),
      fetchProdutos(),
      fetchEntradas(),
      fetchUsuarios(),
    ])
      .catch((error) => {
        message.error(handleErrorException(error));
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fazendaId = form.formValues?.fazendaId;
    if (fazendaId) {
      const filtered = estoques.filter(
        (estoque) => estoque.fazendaId === parseInt(fazendaId)
      );
      setFilteredEstoques(filtered);
    } else {
      setFilteredEstoques([]);
    }
  }, [form.formValues?.fazendaId, estoques]);

  const handleSubmit = async (values: any) => {
    try {
      values.valor = parseFloat(values?.valor);
      values.produtoId = parseInt(values?.produtoId);
      values.fazendaId = parseInt(values?.fazendaId);
      values.estoqueId = parseInt(values?.estoqueId);
      values.quantidade = parseInt(values?.quantidade);
      const userId = Cookie.get("id") ?? "";
      values.usuarioId = parseInt(userId);
      setLoading(true);
      if (form.entityId) {
        await entradaService.patch(form.entityId, values);
      } else {
        await entradaService.post(values);
      }
      await fetchEntradas();
      setModalOpen(false);
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const RemoveClick = async (entrada: Entrada) => {
    await entradaService.delete(entrada?.id);
    await fetchEntradas();
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "produto",
      label: "Produto",
      render: (item: Entrada) => {
        return item?.produto?.nome;
      },
    },
    {
      key: "fazenda",
      label: "Fazenda",
      render: (item: Entrada) => {
        return item?.fazenda?.nome;
      },
    },
    {
      key: "estoque",
      label: "Estoque",
      render: (item: Entrada) => {
        return item?.estoque?.nome;
      },
    },
    { key: "quantidade", label: "Quantidade" },
    {
      key: "valor",
      label: "Valor",
      render: (item: any) => {
        return (
          <>
            {item?.valor?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      key: "usuario",
      label: "Usuário",
      render: (item: Entrada) => {
        return item?.usuario?.nome;
      },
    },
    {
      key: "dataEntrada",
      label: "Data Entrada",
      render: (item: Entrada) => {
        return <>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</>;
      },
    },
    { key: "actions", label: "Ações" },
  ];

  const entradaFormFields: FieldConfig[] = [
    {
      name: "produtoId",
      label: "Produto",
      type: "select",
      options: produtos.map((item) => ({
        value: item.id,
        label: item.nome,
      })),
    },
    {
      name: "fazendaId",
      label: "Fazenda",
      type: "select",
      options: fazendas.map((item) => ({
        value: item.id,
        label: item.nome,
      })),
    },
    {
      name: "estoqueId",
      label: "Estoque",
      type: "select",
      options: filteredEstoques.map((item) => ({
        value: item.id,
        label: item.nome,
      })),
    },
    { name: "quantidade", label: "Quantidade", type: "number" },
    { name: "valor", label: "Valor", type: "money" },
  ];

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      initialFormValues={{}}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <ResourceManager.Header title={"Entrada de Produtos"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Entrada" : "Adicionar Nova Entrada"}
        formFields={entradaFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={entradas}
        columns={columns}
        filter={(entrada: Entrada, search: string) => {
          return (
            entrada?.produto?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            entrada?.fazenda?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            entrada?.estoque?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            false
          );
        }}
        actions={[
          {
            component: ResourceManager.RemoveAction,
            onClick: RemoveClick,
          },
        ]}
      ></ResourceManager.Table>
    </ResourceManager>
  );
};

export default withSidebar(Entrada);
