"use client";
import React, { useState, useEffect } from "react";
import withSidebar from "@/app/components/sidebar/withSidebar";
import type { Usuario } from "@/app/types/Usuario";
import { cpf } from "cpf-cnpj-validator";
import validator from "validator";
import Spinner from "@/app/components/loading/spinner";
import { Form } from "@/app/components/adicionar/form";
import { usuarioService } from "@/services";
import ResourceManager from "@/app/components/resource-manager/resourceManager";
import { handleErrorException } from "@/utils/error";
import { message } from "antd";

const Usuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const form = Form.useForm();
  const [currentPassword, setCurrentPassword] = useState<string>("");

  const userFormFields = [
    { name: "nome", label: "Nome", type: "text" },
    { name: "cpf", label: "CPF", type: "text" },
    { name: "email", label: "Email", type: "text" },
    {
      name: "senha",
      label: "Senha",
      type: "password",
      inputProps: {
        onFocus: (e: any) => {
          setCurrentPassword(e?.target?.value);
          form.setFieldValue("senha", null);
        },
        onBlur: (e: any) => {
          if (!e?.target?.value) {
            form.setFieldValue("senha", currentPassword);
            setCurrentPassword("");
          }
        },
      },
    },
    { name: "ativo", label: "Ativo", type: "checkbox" },
  ];

  const fetchUsuarios = async () => {
    await usuarioService.getAtivo().then((res) => {
      setUsuarios(res.data);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchUsuarios()
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        message.error(handleErrorException(err));
      });
  }, []);

  const handleEditClick = (user: Usuario) => {
    form.setFormValues(user);
    form.setEntityId(user.id);
    form.setErrors({});
    setModalOpen(true);
  };

  const validateCPF = (inputCPF: string) => {
    return cpf.isValid(inputCPF);
  };

  const validadeEmail = (inputEmail: string) => {
    return validator.isEmail(inputEmail);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const { cpf: inputCPF } = values;
    const { email: inputEmail } = values;

    if (!validateCPF(inputCPF.toString())) {
      form.setErrors({ cpf: "CPF inválido" });
      return;
    }

    if (!validadeEmail(inputEmail)) {
      form.setErrors({ email: "Email inválido" });
      return;
    }

    try {
      setLoading(true);
      if (form.entityId) {
        await usuarioService.patch(form.entityId, values);
      } else {
        await usuarioService.post(values);
      }

      await fetchUsuarios();
      setModalOpen(false);
    } catch (error) {
      console.log(error);
      form.setErrors({ submit: handleErrorException(error) });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    {
      key: "cpf",
      label: "CPF",
      render: (item: Usuario) => {
        return cpf.format(item?.cpf || "");
      },
    },
    { key: "email", label: "Email" },
    { key: "actions", label: "Ações" },
  ];

  const initialFormValues = {
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    ativo: true,
  };

  if (loading) return <Spinner />;

  return (
    <ResourceManager
      form={form}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      initialFormValues={initialFormValues}
      loading={loading}
    >
      <ResourceManager.Header title={"Cadastro de Usuários"} />
      <ResourceManager.FormModal
        title={form.entityId ? "Editar Usuário" : "Adicionar Novo Usuário"}
        formFields={userFormFields}
        handleSubmit={handleSubmit}
      />
      <ResourceManager.Table
        data={usuarios}
        columns={columns}
        filter={(item: Usuario, search: string) =>
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

export default withSidebar(Usuario);
