import React, { ChangeEvent, useState } from "react";
import { requestStyle } from "../pages/Request/request.css";
import Input from "@src/common/ui/Input";
import { Parameters } from "../api/docs";
import { typeConverter } from "../util/typeConverter";
import { FormValues } from "../hooks/useForm";

interface ParamsProps {
  params: Parameters[];
  formValues: FormValues;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleArray: {
    addArrayItem: (key: string, value: string) => void;
    removeArrayItem: (key: string, index: number) => void;
  };
}

const Params = ({
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
      <h3 className={requestStyle.description}>Params</h3>
      {params.map((param, idx) => (
        <>
          {param.schema.type === "array" ? (
            <ArrayParam
              value={paramValue}
              param={param}
              formValues={formValues}
              handleChange={onChangeParamValue}
              idx={idx}
              addArrayItem={onAddArrayItem}
              removeArrayItem={removeArrayItem}
            />
          ) : (
            <NormalParam
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

export default Params;

interface NormalParamProps {
  param: Parameters;
  formValues: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  idx: number;
}

const NormalParam = ({
  param,
  formValues,
  handleChange,
  idx,
}: NormalParamProps) => {
  return (
    <>
      <div className={requestStyle.inputWrapper} key={param.name}>
        <div className={requestStyle.inputBox} key={param.name}>
          <label className={requestStyle.label}>{param.name}</label>
          <label className={requestStyle.type ?? ""}>
            {typeConverter(param.schema?.type)}
          </label>
          <Input
            style={{ width: "40%", textAlign: "right" }}
            type={param.schema?.type ?? "string"}
            name={param.name}
            value={formValues[param.name] as string}
            placeholder={param?.example !== undefined ? param.example + "" : ""}
            required={param.required}
            onChange={handleChange}
            defaultValue={
              param.required ? param.example ?? "" : param.schema?.default ?? ""
            }
            autoFocus={idx === 0}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </>
  );
};

interface ArrayParamProps {
  param: Parameters;
  formValues: FormValues;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  idx: number;
  addArrayItem: (key: string) => void;
  removeArrayItem: (key: string, index: number) => void;
}

const ArrayParam = ({
  param,
  formValues,
  value,
  handleChange,
  idx,
  addArrayItem,
  removeArrayItem,
}: ArrayParamProps) => {
  return (
    <>
      <div className={requestStyle.inputWrapper} key={param.name}>
        <div className={requestStyle.inputBox} key={param.name}>
          <label className={requestStyle.label}>{param.name}</label>
          <label className={requestStyle.type ?? ""}>
            {typeConverter(param.schema?.type)}
          </label>
          <div className={requestStyle.rightWrapper}>
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
              className={requestStyle.plusButton}
            >
              +
            </button>
          </div>
        </div>
        <div className={requestStyle.arrayBoxWrapper} key={param.name}>
          {(formValues[param.name] as string[])?.map((value, idx) => (
            <button
              onClick={() => removeArrayItem(param.name, idx)}
              className={requestStyle.arrayGreenBox}
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
