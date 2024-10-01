"use client";
import React, { useEffect, useState } from "react";
import { Form } from "@/app/components/adicionar/form";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import withSidebar from "@/app/components/sidebar/withSidebar";
import { FieldConfig } from "@/app/components/adicionar/formulario";
import { fazendaService } from "@/services/fazenda.service";
import { estoqueService } from "@/services/estoque.service";
import { produtoService } from "@/services/produto.service";
import { saidaService } from "@/services/saida.service";
import { usuarioService } from "@/services/usuario.service";
import { Produto } from "@/app/types/Produto";
import { Estoque } from "@/app/types/Estoque";
import { Fazenda } from "@/app/types/Fazenda";
import type { Saida } from "@/app/types/Saida";
import { Usuario } from "@/app/types/Usuario";
import Cookie from "js-cookie";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";

const Saida: React.FC = () => {
  const form = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredEstoques, setFilteredEstoques] = useState<Estoque[]>([]);

  const fetchFazendas = async () => {
    const res = await fazendaService.getAtivo();
    setFazendas(res.data);
  };

  const fetchEstoques = async () => {
    const res = await estoqueService.getAtivo();
    setEstoques(res.data);
  };

  const fetchProdutos = async () => {
    const res = await produtoService.getAtivo();
    setProdutos(res.data);
  };

  const fetchSaidas = async () => {
    const res = await saidaService.get();
    setSaidas(res.data);
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
      fetchSaidas(),
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
      values.produtoId = parseInt(values?.produtoId);
      values.fazendaId = parseInt(values?.fazendaId);
      values.estoqueId = parseInt(values?.estoqueId);
      values.quantidade = parseInt(values?.quantidade);
      const userId = Cookie.get("id") ?? "";
      values.usuarioId = parseInt(userId);
      setLoading(true);
      if (form.entityId) {
        await saidaService.patch(form.entityId, values);
      } else {
        await saidaService.post(values);
      }
      await fetchSaidas();
      setModalOpen(false);
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const RemoveClick = async (saida: Saida) => {
    await saidaService.delete(saida.id);
    await fetchSaidas();
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "produto",
      label: "Produto",
      render: (item: Saida) => item?.produto?.nome,
    },
    {
      key: "fazenda",
      label: "Fazenda",
      render: (item: Saida) => item?.fazenda?.nome,
    },
    {
      key: "estoque",
      label: "Estoque",
      render: (item: Saida) => item?.estoque?.nome,
    },
    { key: "quantidade", label: "Quantidade" },
    {
      key: "usuario",
      label: "Usuário",
      render: (item: Saida) => {
        return item?.usuario?.nome;
      },
    },
    {
      key: "dataSaida",
      label: "Data Saida",
      render: (item: Saida) => {
        return <>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</>;
      },
    },
    { key: "actions", label: "Ações" },
  ];

  const saidaFormFields: FieldConfig[] = [
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
  ];

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      initialFormValues={{}}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <ResourceManager.Header title={"Saída de Produtos"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Saída" : "Adicionar Nova Saída"}
        formFields={saidaFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={saidas}
        columns={columns}
        filter={(saida: Saida, search: string) => {
          return (
            saida?.produto?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            saida?.fazenda?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            saida?.estoque?.nome
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
      />
    </ResourceManager>
  );
};

export default withSidebar(Saida);
