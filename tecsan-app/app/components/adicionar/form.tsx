import { createContext, ReactNode, useContext, useState } from "react";

import React from 'react';

interface FormContextProps {
    form: FormInstance
}

export const FormContext = createContext<FormContextProps>({
    form: {
        formValues: {},
        setFormValues: () => { },
        setFieldValue: () => { },
        entityId: null,
        setEntityId: () => { },
        errors:{},
        setErrors:()=>{}
        }
});

type FormProps = {
    form: FormInstance
    onSubmit: (values: any) => void;
    children: React.ReactNode;
};


export const Form = ({ children, form, onSubmit }: FormProps) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form.formValues);
    }

    return (
        <FormContext.Provider value={{ form }}>
            <form onSubmit={handleSubmit}>
                {children}
            </form>
        </FormContext.Provider>
    );
};

interface FormItemProps {
    name: string;
    label: string | ReactNode;
    children: ReactNode;
    getCustomValue?: (onChangeEvent: React.ChangeEvent<any>) => any
}

const Item = ({ name, label, children, getCustomValue }: FormItemProps) => {
    let formContext = useContext(FormContext)


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { value } = e.target as HTMLInputElement;
        let valor;
        if (getCustomValue) {
            valor = getCustomValue(e)
        }
        else {
            valor = value
        }

        formContext.form.setFieldValue(name, valor);
    };

    const value = formContext.form.formValues[name]

    const renderChildren = () => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                const childOnChange = child.props.onChange as React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> | undefined;
                const isFileInput = child.props.type === 'file';
                return React.cloneElement(child, {
                    value: isFileInput ? undefined : (value || ""),
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                        handleChange(e);

                        if (childOnChange) {
                            childOnChange(e);
                        }
                    }
                } as Partial<React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement>>);
            }
            return child;
        });
    }

    return (
        <div className="mb-4">
            {typeof (label) == "string"
                ?
                <label className="block mb-1 font-semibold">{label}</label>
                :
                <>{label}</>
            }

            {renderChildren()}
        </div>
    )
}

Form.Item = Item

export interface FormInstance {
    formValues: Record<string, any>;
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>
    setFieldValue: (name: string, value: any) => void
    entityId: number | null
    setEntityId: React.Dispatch<React.SetStateAction<number | null>>
    errors: Record<string, string>
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

Form.useForm = (): FormInstance => {

    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [entityId, setEntityId] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const setFieldValue = (
        name: string,
        value: any
    ) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return {
        formValues,
        setFormValues,
        setFieldValue,
        entityId,
        setEntityId,
        errors,
        setErrors
    }

}