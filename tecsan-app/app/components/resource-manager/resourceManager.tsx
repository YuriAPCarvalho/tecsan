"use client";
import React, {
  useState,
  ReactNode,
  createContext,
  useContext,
  ElementType,
} from "react";
import Tabela, { Column } from "@/app/components/tabela/tabelaComponents";
import Spinner from "@/app/components/loading/spinner";
import Modal from "../adicionar/modalComponents";
import DynamicForm, { FieldConfig } from "../adicionar/formulario";
import { FormInstance } from "../adicionar/form";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

interface ResourceManagerProps {
  children: ReactNode;
  loading: boolean;
  form: FormInstance | undefined;
  modalOpen: boolean;
  initialFormValues: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IResourceManagerContext {
  form: FormInstance | undefined;
  modalOpen: boolean;
  initialFormValues: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResourceManagerContext = createContext<IResourceManagerContext>({
  form: undefined,
  modalOpen: false,
  initialFormValues: {},
  setModalOpen: () => {},
});

const ResourceManager = ({
  form,
  children,
  loading,
  modalOpen,
  setModalOpen,
  initialFormValues,
}: ResourceManagerProps) => {
  if (loading) return <Spinner />;

  return (
    <ResourceManagerContext.Provider
      value={{ form, modalOpen, initialFormValues, setModalOpen }}
    >
      <div className="mt-5">{children}</div>
    </ResourceManagerContext.Provider>
  );
};

const ResourceManagerHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center mb-4 ml-6">
      <h1 className="text-2xl font-bold flex-grow">{title}</h1>
    </div>
  );
};

const ResourceManagerTable = ({
  data = [],
  columns = [],
  actions,
  filter,
  expandable = false,
}: {
  data: any[];
  columns: Column[];
  actions?: { component: ElementType; onClick: (item: any) => void }[];
  filter?: (item: any, search: string) => boolean;
  expandable?: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5000);
  const filteredData =
    filter && data ? data?.filter((item) => filter(item, search)) : data || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const resourceManagerContext = useContext(ResourceManagerContext);
  const handleAddClick = () => {
    resourceManagerContext.form?.setFormValues(
      resourceManagerContext.initialFormValues
    );
    resourceManagerContext.form?.setEntityId(null);
    resourceManagerContext.form?.setErrors({});
    resourceManagerContext.setModalOpen(true);
  };

  return (
    <>
      <div className="flex mr-6 justify-between items-center mb-4 ml-6">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 w-96 border rounded"
        />
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded ml-4"
        >
          Adicionar
        </button>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        <Tabela
          expandable={expandable}
          columns={columns}
          data={currentItems.map((item) => ({
            ...item,
            actions: actions?.map((action, index) => {
              let { component: Element, onClick } = action;
              return (
                <Element
                  key={index + "_action"}
                  onClick={() => {
                    onClick(item);
                  }}
                />
              );
            }),
          }))}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredData.length}
        />
      </div>
    </>
  );
};

const ResourceManagerTableCustom = ({
  data = [],
  columns = [],
  actions,
  filter,
  expandable = false,
  renderExpandedContent,
}: {
  data: any[];
  columns: Column[];
  actions?: { component: ElementType; onClick: (item: any) => void }[];
  filter?: (item: any) => boolean;
  expandable?: boolean;
  renderExpandedContent?: (item: any) => ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5000);
  const filteredData =
    filter && data ? data?.filter((item) => filter(item)) : data || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Tabela
        expandable={expandable}
        renderExpandedContent={renderExpandedContent}
        columns={columns}
        data={currentItems.map((item) => ({
          ...item,
          actions: actions?.map((action, index) => {
            let { component: Element, onClick } = action;
            return (
              <Element
                key={index + "_action"}
                onClick={() => {
                  onClick(item);
                }}
              />
            );
          }),
        }))}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredData.length}
      />
    </>
  );
};

const ResourceManagerFormModal = ({
  formFields = [],
  handleSubmit,
  title,
}: {
  formFields: FieldConfig[];
  title: string;
  handleSubmit: (values: Record<string, any>) => void;
}) => {
  const resourceManagerContext = useContext(ResourceManagerContext);
  return (
    <>
      <Modal
        isOpen={resourceManagerContext.modalOpen}
        onClose={() => resourceManagerContext.setModalOpen(false)}
        title={title}
      >
        {resourceManagerContext?.form && (
          <DynamicForm
            form={resourceManagerContext.form}
            fields={formFields}
            onSubmit={handleSubmit}
            onClose={() => resourceManagerContext.setModalOpen(false)}
            errors={resourceManagerContext.form.errors}
          />
        )}
      </Modal>
    </>
  );
};

const EditAction = ({ ...props }) => {
  return (
    <button
      {...props}
      className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded"
    >
      <PencilIcon className="w-5 h-5" />
    </button>
  );
};

const RemoveAction = ({ ...props }) => {
  return (
    <button
      {...props}
      className="text-red-500 hover:text-red-700 px-3 py-1 rounded"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
};

ResourceManager.Header = ResourceManagerHeader;
ResourceManager.FormModal = ResourceManagerFormModal;
ResourceManager.Table = ResourceManagerTable;
ResourceManager.TableCustom = ResourceManagerTableCustom;
ResourceManager.EditAction = EditAction;
ResourceManager.RemoveAction = RemoveAction;
export default ResourceManager;
