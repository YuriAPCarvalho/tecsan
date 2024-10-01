"use client";
import React, { useState, useEffect } from "react";
import type { Produto } from "@/app/types/Produto";
import withSidebar from "@/app/components/sidebar/withSidebar";
import Spinner from "@/app/components/loading/spinner";
import { Categoria } from "@/app/types/Categoria";
import { Form } from "@/app/components/adicionar/form";
import { API_URL } from "@/constants/environment-variables";
import { categoriaService } from "@/services/categoria.service";
import { produtoService } from "@/services/produto.service";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";

const Produto: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const form = Form.useForm();

  const produtoFormFields = [
    { name: "patrimonio", label: "Patrimônio", type: "text" },
    { name: "nome", label: "Descrição", type: "text" },
    {
      name: "categoriaId",
      label: "Categoria",
      type: "select",
      options: categorias.map((categoria) => ({
        value: categoria.id,
        label: categoria.nome,
      })),
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "novo", label: "Novo" },
        { value: "usado", label: "Usado" },
      ],
    },
    {
      name: "foto",
      label: "Foto",
      type: "file",
    },
    { name: "ativo", label: "Ativo", type: "checkbox" },
  ];

  const fetchProdutos = async () => {
    try {
      await produtoService.getAtivo().then((res) => {
        setProdutos(res.data);
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    await categoriaService.getAtivo().then((res) => {
      setCategorias(res.data);
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategorias(), fetchProdutos()])
      .catch((err) => {
        message.error(handleErrorException(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEditClick = (produto: Produto) => {
    form.setFormValues(produto);
    form.setEntityId(produto.id);
    form.setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (value) formData.append(key, value.toString());
    });

    formData.append("foto", values.foto);

    try {
      setLoading(true);
      if (form.entityId) {
        await produtoService.patch(form.entityId, formData);
      } else {
        await produtoService.post(formData);
      }

      await fetchProdutos();
      setModalOpen(false);
    } catch (error) {
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const renderPhotoPreview = (foto: string) => {
    const isUrl = foto.startsWith("http") || foto.startsWith("https");
    const fotoUrl = isUrl ? foto : `${API_URL}/${foto}`;

    if (fotoUrl) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={fotoUrl}
            alt="Foto do Produto"
            className="w-8 h-8 object-cover"
          />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-600">
        Sem imagem
      </div>
    );
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "foto",
      label: "Foto",
      render: (item: any) => {
        return <> {renderPhotoPreview(item?.foto)} </>;
      },
    },
    { key: "nome", label: "Nome" },
    {
      key: "categoria",
      label: "Categoria",
      render: (item: any) => {
        return categorias.find((c) => c.id === item.categoriaId)?.nome || "";
      },
    },

    { key: "patrimonio", label: "Patrimônio" },

    { key: "estado", label: "Estado" },

    { key: "actions", label: "Ações" },
  ];

  const initialFormValues = {
    patrimonio: "",
    nome: "",
    categoriaId: categorias[0]?.id || "",
    estado: "",
    foto: null,
    ativo: true,
  };

  if (loading) return <Spinner />;

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      initialFormValues={initialFormValues}
      setModalOpen={setModalOpen}
      loading={loading}
    >
      <ResourceManager.Header title={"Cadastro de Produtos"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Produto" : "Adicionar Nova Produto"}
        formFields={produtoFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={produtos}
        columns={columns}
        filter={(item: Produto, search: string) =>
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

export default withSidebar(Produto);
