import type { ChangeEvent } from "react";
import { useState } from "react";

const useForm = () => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return { formValues, handleChange, setFormValues };
};

export default useForm;
