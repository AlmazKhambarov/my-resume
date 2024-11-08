import { useEffect, useState } from "react";
import { FormField } from "./types";

interface UseFormStateProps<T> {
  fields: FormField<keyof T>[];
  initialValues?: Partial<T>;
  onFormChange?: (name: keyof T, value: string | number | boolean) => void;
}

export const useFormState = <T>({ 
  fields, 
  initialValues, 
  onFormChange 
}: UseFormStateProps<T>) => {
  const [formValues, setFormValues] = useState<T>({} as T);

  useEffect(() => {
    if (initialValues) {
      setFormValues(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (name: keyof T, value: string | number | boolean) => {
    setFormValues(prev => ({ ...prev, [name]: value as T[keyof T] }));
    onFormChange?.(name, value);
  };

  const isFormValid = () => {
    return fields
      .filter(field => field.required)
      .every(field => {
        const value = formValues[field.name];
        return value !== undefined && value !== null && value !== "";
      });
  };

  const resetForm = () => {
    setFormValues({} as T);
  };

  return {
    formValues,
    setFormValues,
    handleChange,
    isFormValid,
    resetForm
  };
};
