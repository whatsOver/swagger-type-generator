import type { ChangeEvent } from "react";
import { useState } from "react";

type ValueType = string | File | (string | File)[];
export interface FormValues {
  [key: string]: ValueType;
}

const useForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({});

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

  return {
    formValues,
    handleChange,
    setFormValues,
    handleArray: { addArrayItem, removeArrayItem },
  };
};

export default useForm;
