'use client'
import React, { InputHTMLAttributes } from "react";
import ToggleSwitch from "@/app/components/adicionar/toggleSwitch";
import { Form, FormInstance } from "./form";
import { CampoDinheiro } from "../campo-dinheiro/campoDinheiro";
import { Alert } from "antd";

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  previewImageUrl?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>
}

interface DynamicFormProps {
  form: FormInstance
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onClose: () => void;
  errors?: Record<string, string>;
  previewImage?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  form,
  fields,
  onSubmit,
  onClose,
  errors = {},
  previewImage = "",
}) => {

  const handleToggleChange = (name: string, value: boolean) => {
    form.setFieldValue(name, value)
  };
  const formErrors = errors["submit"]

  return (
    <Form form={form} onSubmit={onSubmit}>
      {fields.map((field, index: number) => {
        const errorMessage = errors[field.name];
        if (field.type === "money") {
          return (
            <div key={field.name} className="mb-4 flex flex-col">
              <label className="mr-4 font-semibold">{field.label}</label>
              <CampoDinheiro
                className={`w-full px-3 py-2 border rounded ${errorMessage ? "border-red-500" : ""}`}
                onChangeValue={(v: string) => { form.setFieldValue(field.name, v) }} value={form.formValues[field.name] || ''}>
              </CampoDinheiro>
            </div>
          );
        }

        if (field.type === "checkbox") {
          return (
            <div key={field.name} className="mb-4 flex items-center">
              <label className="mr-4 font-semibold">{field.label}</label>
              <ToggleSwitch
                isChecked={form.formValues[field.name] || false}
                onChange={(isChecked) =>
                  handleToggleChange(field.name, isChecked)
                }
              />
            </div>
          );
        }
        if (field.type === "select") {
          return (
            <div key={field.name} className="mb-4">
              <Form.Item name={field.name} label={field.label}>
                <select 
                  {...field.inputProps}
                className={`w-full px-3 py-2 border rounded ${errorMessage ? "border-red-500" : ""}`}  >
                  <option value="">Selecione uma opção</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Form.Item>

              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
          );
        }

        if (field.type === "file") {
          return (
            <div key={field.name} className="mb-4">
              <Form.Item name={field.name}
                getCustomValue={(e) => {
                  let { files } = e?.target
                  return files?.[0]
                }}
                label={field.label}>
                <input
                  {...field.inputProps}
                  type={"file"}
                  className={`w-full px-3 py-2 border rounded ${errorMessage ? "border-red-500" : ""}`}
                  placeholder={field.placeholder} />
              </Form.Item>

              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Pré-visualização"
                    className="w-full h-auto border rounded" />
                </div>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
          );
        }
        return (
          <div key={field.name + index} className="mb-4">
            <Form.Item name={field.name} label={field.label}>
              <input
                {...field.inputProps}
                type={field.type}
                className={`w-full px-3 py-2 border rounded ${errorMessage ? "border-red-500" : ""}`}
                placeholder={field.placeholder} />
            </Form.Item>

            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        );
      })}

      <div className="flex items-center flex-col">
        {
          formErrors && (<Alert className="w-full mb-2" message={formErrors} type="error" showIcon closable  >
          </Alert>)
        }
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Salvar
        </button>
      </div>
    </Form>
  );
};

export default DynamicForm;
