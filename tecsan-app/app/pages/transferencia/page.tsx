"use client";
import React, { useEffect, useState } from "react";
import { Form } from "@/app/components/adicionar/form";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import withSidebar from "@/app/components/sidebar/withSidebar";
import { FieldConfig } from "@/app/components/adicionar/formulario";
import { fazendaService } from "@/services/fazenda.service";
import { estoqueService } from "@/services/estoque.service";
import { produtoService } from "@/services/produto.service";
import { transferenciaService } from "@/services/transferencia.service";
import { usuarioService } from "@/services/usuario.service";
import type { Transferencia } from "@/app/types/Transferencia";
import { Estoque } from "@/app/types/Estoque";
import { Fazenda } from "@/app/types/Fazenda";
import { Produto } from "@/app/types/Produto";
import { Usuario } from "@/app/types/Usuario";
import Cookie from "js-cookie";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";

const Transferencia: React.FC = () => {
  const form = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferencias, setTransferencias] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredEstoquesOrigem, setFilteredEstoquesOrigem] = useState<
    Estoque[]
  >([]);
  const [filteredEstoquesDestino, setFilteredEstoquesDestino] = useState<
    Estoque[]
  >([]);

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

  const fetchTransferencias = async () => {
    await transferenciaService.get().then((res) => {
      setTransferencias(res.data);
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
      fetchTransferencias(),
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
    const fazendaOrigemId = form.formValues?.fazendaOrigemId;
    if (fazendaOrigemId) {
      const filtered = estoques.filter(
        (estoque) => estoque.fazendaId === parseInt(fazendaOrigemId)
      );
      setFilteredEstoquesOrigem(filtered);
    } else {
      setFilteredEstoquesOrigem([]);
    }
  }, [form.formValues?.fazendaOrigemId, estoques]);

  useEffect(() => {
    const fazendaDestinoId = form.formValues?.fazendaDestinoId;
    if (fazendaDestinoId) {
      const filtered = estoques.filter(
        (estoque) => estoque.fazendaId === parseInt(fazendaDestinoId)
      );
      setFilteredEstoquesDestino(filtered);
    } else {
      setFilteredEstoquesDestino([]);
    }
  }, [form.formValues?.fazendaDestinoId, estoques]);

  const handleSubmit = async (values: any) => {
    try {
      values.produtoId = parseInt(values?.produtoId);
      values.fazendaOrigemId = parseInt(values?.fazendaOrigemId);
      values.fazendaDestinoId = parseInt(values?.fazendaDestinoId);
      values.estoqueOrigemId = parseInt(values?.estoqueOrigemId);
      values.estoqueDestinoId = parseInt(values?.estoqueDestinoId);
      values.quantidade = parseInt(values?.quantidade);
      const userId = Cookie.get("id") ?? "";
      values.usuarioId = parseInt(userId);

      setLoading(true);
      if (form.entityId) {
        await transferenciaService.patch(form.entityId, values);
      } else {
        await transferenciaService.post(values);
      }
      await fetchTransferencias();
      setModalOpen(false);
    } catch (error) {
      form.setFormValues({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const RemoveClick = async (entrada: Transferencia) => {
    await transferenciaService.delete(entrada?.id);
    await fetchTransferencias();
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "produto",
      label: "Produto",
      render: (item: Transferencia) => {
        return item?.produto?.nome;
      },
    },
    {
      key: "fazendaOrigem",
      label: "Fazenda Origem",
      render: (item: Transferencia) => {
        return item?.fazendaOrigem?.nome;
      },
    },
    {
      key: "fazendaDestino",
      label: "Fazenda Destino",
      render: (item: Transferencia) => {
        return item?.fazendaDestino?.nome;
      },
    },
    {
      key: "estoqueOrigem",
      label: "Estoque Origem",
      render: (item: Transferencia) => {
        return item?.estoqueOrigem?.nome;
      },
    },
    {
      key: "estoqueDestino",
      label: "Estoque Destino",
      render: (item: Transferencia) => {
        return item?.estoqueDestino?.nome;
      },
    },
    { key: "quantidade", label: "Quantidade" },
    {
      key: "usuario",
      label: "Usuário",
      render: (item: Transferencia) => {
        return item?.usuario?.nome;
      },
    },
    {
      key: "dataTransferencia",
      label: "Data Transferência",
      render: (item: Transferencia) => {
        return <>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</>;
      },
    },
    { key: "actions", label: "Ações" },
  ];

  const transferenciaFormFields: FieldConfig[] = [
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
      name: "fazendaOrigemId",
      label: "Fazenda Origem",
      type: "select",
      options: fazendas.map((item) => ({
        value: item.id,
        label: item.nome,
      })),
    },
    {
      name: "fazendaDestinoId",
      label: "Fazenda Destino",
      type: "select",
      options: fazendas.map((item) => ({
        value: item.id,
        label: item.nome,
      })),
    },
    {
      name: "estoqueOrigemId",
      label: "Estoque Origem",
      type: "select",
      options: filteredEstoquesOrigem.map((item) => ({
        value: item.id,
        label: item.nome,
      })),
    },
    {
      name: "estoqueDestinoId",
      label: "Estoque Destino",
      type: "select",
      options: filteredEstoquesDestino.map((item) => ({
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
      <ResourceManager.Header title={"Transferências de Produtos"} />
      <ResourceManager.FormModal
        title={
          form.entityId ? "Editar Transferência" : "Realizar Transferência"
        }
        formFields={transferenciaFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={transferencias}
        columns={columns}
        filter={(entrada: Transferencia, search: string) => {
          return (
            entrada?.produto?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            entrada?.fazendaOrigem?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            entrada?.estoqueOrigem?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            entrada?.fazendaDestino?.nome
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            entrada?.estoqueDestino?.nome
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

export default withSidebar(Transferencia);
