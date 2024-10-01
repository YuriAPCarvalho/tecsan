"use client";
import React, { useState, useEffect } from "react";
import type { Fazenda } from "@/app/types/Fazenda";
import withSidebar from "@/app/components/sidebar/withSidebar";
import Spinner from "@/app/components/loading/spinner";
import { Form } from "@/app/components/adicionar/form";
import { fazendaService } from "@/services/fazenda.service";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import { message } from "antd";
import { handleErrorException } from "@/utils/error";

const Fazenda: React.FC = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const form = Form.useForm();

  const fetchFazendas = async () => {
    try {
      await fazendaService.getAtivo().then((res) => {
        setFazendas(res.data);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFazendas()
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        message.error(handleErrorException(err));
      });
  }, []);

  const handleEditClick = (fazenda: Fazenda) => {
    form.setFormValues(fazenda);
    form.setEntityId(fazenda.id);
    form.setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const updatedValues = { ...values };
      if (form.entityId) {
        updatedValues.updatedAt = new Date();
      }
      setLoading(true);
      if (form.entityId) {
        await fazendaService.patch(form.entityId, values);
      } else {
        await fazendaService.post(values);
      }

      await fetchFazendas();
      setModalOpen(false);
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const fazendaFormFields = [
    { name: "nome", label: "Fazenda", type: "text" },
    { name: "ativo", label: "Ativo", type: "checkbox" },
  ];

  const initialFormValues = {
    fazenda: "",
    ativo: true,
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Fazenda" },
    { key: "actions", label: "Ações" },
  ];

  if (loading) return <Spinner />;

  return (
    <ResourceManager
      form={form}
      initialFormValues={initialFormValues}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <ResourceManager.Header title={"Cadastro de Fazendas"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Fazenda" : "Adicionar Nova Fazenda"}
        formFields={fazendaFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={fazendas}
        columns={columns}
        filter={(item: Fazenda, search: string) =>
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

export default withSidebar(Fazenda);
