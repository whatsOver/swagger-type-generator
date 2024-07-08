import { Parameters } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import { ChangeEvent, useState } from "react";
import { RequestArrayParam } from "../array-param/RequestArrayParam";
import { RequestNormalParam } from "../normal-param/RequestNormalParam";
import { apiParamStyles } from "./apiParam.css";

interface ParamsProps {
  params: Parameters[];
  formValues: FormValues;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleArray: {
    addArrayItem: (key: string, value: string) => void;
    removeArrayItem: (key: string, index: number) => void;
  };
}

export const RequestParam = ({
  params,
  formValues,
  handleChange,
  handleArray: { addArrayItem, removeArrayItem },
}: ParamsProps) => {
  // Array Param용 state
  // 기존에 custom hook으로 관리하던 paramState와 달리 하나의 input만 담당
  const [paramValue, setParamValue] = useState("");

  const onChangeParamValue = (e: ChangeEvent<HTMLInputElement>) => {
    setParamValue(e.target.value);
  };

  const onAddArrayItem = (key: string) => {
    addArrayItem(key, paramValue);
    setParamValue("");
  };

  return (
    <>
      <h3 className={apiParamStyles.description}>Params</h3>
      {params.map((param, idx) => (
        <>
          {param.schema.type === "array" ? (
            <RequestArrayParam
              value={paramValue}
              param={param}
              formValues={formValues}
              handleChange={onChangeParamValue}
              idx={idx}
              addArrayItem={onAddArrayItem}
              removeArrayItem={removeArrayItem}
            />
          ) : (
            <RequestNormalParam
              param={param}
              formValues={formValues}
              handleChange={handleChange}
              idx={idx}
            />
          )}
        </>
      ))}
    </>
  );
};
