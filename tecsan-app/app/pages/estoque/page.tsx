"use client";
import React, { useState, useEffect } from "react";
import type { Estoque } from "@/app/types/Estoque";
import type { Fazenda } from "@/app/types/Fazenda";
import withSidebar from "@/app/components/sidebar/withSidebar";
import Spinner from "@/app/components/loading/spinner";
import { Form } from "@/app/components/adicionar/form";
import { estoqueService } from "@/services/estoque.service";
import { fazendaService } from "@/services/fazenda.service";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import { message } from "antd";
import { handleErrorException } from "@/utils/error";

const Estoque: React.FC = () => {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const form = Form.useForm();

  const fetchEstoques = async () => {
    await estoqueService.getAtivo().then((res) => {
      setEstoques(res.data);
    });
  };

  const fetchFazendas = async () => {
    await fazendaService.getAtivo().then((res) => {
      setFazendas(res.data);
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEstoques(), fetchFazendas()])
      .catch((err) => {
        message.error(handleErrorException(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEditClick = (estoque: Estoque) => {
    form.setFormValues(estoque);
    form.setEntityId(estoque.id);
    form.setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const updatedValues = {
        ...values,
        fazendaId: Number(values.fazendaId),
      };
      setLoading(true);
      if (form.entityId) {
        await estoqueService.patch(form.entityId, updatedValues);
      } else {
        await estoqueService.post(updatedValues);
      }

      await fetchEstoques();
      setModalOpen(false);
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const estoqueFormFields = [
    { name: "nome", label: "Estoque", type: "text" },
    {
      name: "fazendaId",
      label: "Fazenda",
      type: "select",
      options: fazendas.map((fazenda) => ({
        value: fazenda.id,
        label: fazenda.nome,
      })),
    },
    { name: "ativo", label: "Ativo", type: "checkbox" },
  ];

  const initialFormValues = {
    nome: "",
    fazendaId: fazendas[0]?.id,
    ativo: true,
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Estoque" },
    {
      key: "fazenda",
      label: "Fazenda",
      render: (estoque: any) => {
        return fazendas.find((f) => f.id === estoque?.fazendaId)?.nome || "";
      },
    },
    { key: "actions", label: "Ações" },
  ];

  if (loading) return <Spinner />;

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      initialFormValues={initialFormValues}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <ResourceManager.Header title={"Cadastro de Estoques"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Estoque" : "Adicionar Novo Estoque"}
        formFields={estoqueFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={estoques}
        columns={columns}
        filter={(item: Estoque, search: string) =>
          item.nome.toLowerCase().includes(search.toLowerCase())
        }
        actions={[
          {
            component: ResourceManager.EditAction,
            onClick: handleEditClick,
          },
        ]}
      ></ResourceManager.Table>
    </ResourceManager>
  );
};

export default withSidebar(Estoque);
