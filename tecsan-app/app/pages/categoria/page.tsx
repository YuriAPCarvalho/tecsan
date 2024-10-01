"use client";
import React, { useState, useEffect } from "react";
import type { Categoria } from "@/app/types/Categoria";
import withSidebar from "@/app/components/sidebar/withSidebar";
import { Form } from "@/app/components/adicionar/form";
import { categoriaService } from "@/services/categoria.service";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import { message } from "antd";
import { handleErrorException } from "@/utils/error";

const Categoria: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const form = Form.useForm();

  const fetchCategorias = async () => {
    try {
      await categoriaService.getAtivo().then((res) => {
        setCategorias(res.data);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCategorias()
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        message.error(handleErrorException(err));
      });
  }, []);

  const handleEditClick = (categoria: Categoria) => {
    form.setFormValues(categoria);
    form.setEntityId(categoria.id);
    form.setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      if (form.entityId) {
        await categoriaService.patch(form.entityId, values);
      } else {
        await categoriaService.post(values);
      }
      await fetchCategorias();
      setModalOpen(false);
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "actions", label: "Ações" },
  ];

  const categoriaFormFields = [
    { name: "nome", label: "Nome", type: "text" },
    { name: "ativo", label: "Ativo", type: "checkbox" },
  ];

  const initialFormValues = {
    nome: "",
    ativo: true,
  };

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      initialFormValues={initialFormValues}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <ResourceManager.Header title={"Cadastro de Categorias"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Categoria" : "Adicionar Nova Categoria"}
        formFields={categoriaFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={categorias}
        columns={columns}
        filter={(item: Categoria, search: string) =>
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

export default withSidebar(Categoria);
