import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

type ValueType = string | File | (string | File)[];
export interface FormValues {
  [key: string]: ValueType;
}

export interface ReturnUseForm {
  formValues: FormValues;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  handleArray: {
    addArrayItem: (key: string, value: string | File) => void;
    removeArrayItem: (key: string, index: number) => void;
  };
  resetFormValues: () => void;
  settingFormValues: (values: FormValues) => void;
}

const useForm = (initialValues?: FormValues): ReturnUseForm => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues || {});

  useEffect(() => {
    if (!initialValues) return;
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const addArrayItem = (key: string, value: string | File) => {
    setFormValues((prev) => {
      if (!prev[key]) return { ...prev, [key]: [value] };
      return {
        ...prev,
        [key]: [...(prev[key] as string[] | File[]), value],
      };
    });
  };

  const removeArrayItem = (key: string, index: number) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((_, i) => i !== index),
    }));
  };

  const resetFormValues = () => {
    setFormValues({});
  };

  const settingFormValues = (values: FormValues) => {
    setFormValues(values);
  };

  return {
    formValues,
    handleChange,
    setFormValues,
    handleArray: { addArrayItem, removeArrayItem },
    resetFormValues,
    settingFormValues,
  };
};

export default useForm;
