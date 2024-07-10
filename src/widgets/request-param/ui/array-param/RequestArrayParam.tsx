import { Parameters } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import Input from "@/shared/ui/Input";
import { typeConverter } from "@/shared/util/typeConverter";
import { ChangeEvent } from "react";
import { requestArrayParamStyles } from "./requestArrayParam.css";

interface ArrayParamProps {
  param: Parameters;
  formValues: FormValues;
  value: string;
  idx: number;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addArrayItem: (key: string) => void;
  removeArrayItem: (key: string, index: number) => void;
}

export const RequestArrayParam = ({
  param,
  formValues,
  value,
  idx,
  handleChange,
  addArrayItem,
  removeArrayItem,
}: ArrayParamProps) => {
  return (
    <>
      <div className={requestArrayParamStyles.inputWrapper} key={param.name}>
        <div className={requestArrayParamStyles.inputBox} key={param.name}>
          <label className={requestArrayParamStyles.label}>{param.name}</label>
          <label className={requestArrayParamStyles.type}>
            {typeConverter(param.schema?.type)}
          </label>
          <div className={requestArrayParamStyles.rightWrapper}>
            <Input
              style={{ width: "100%", textAlign: "right" }}
              type={param.schema?.type ?? "string"}
              name={param.name}
              value={value}
              placeholder={
                param?.example !== undefined ? param.example + "" : ""
              }
              onChange={handleChange}
              defaultValue={
                param.required
                  ? param.example ?? ""
                  : param.schema?.default ?? ""
              }
              autoFocus={idx === 0}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => addArrayItem(param.name)}
              type="button"
              className={requestArrayParamStyles.plusButton}
            >
              +
            </button>
          </div>
        </div>
        <div
          className={requestArrayParamStyles.arrayBoxWrapper}
          key={param.name}
        >
          {(formValues[param.name] as string[])?.map((value, idx) => (
            <button
              onClick={() => removeArrayItem(param.name, idx)}
              className={requestArrayParamStyles.arrayGreenBox}
              key={idx}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
