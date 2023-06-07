import React from "react";
import { requestStyle } from "./styles/request.css";
import Input from "@src/common/ui/Input";
import { Parameters } from "../api/docs";
import { typeConverter } from "../util/typeConverter";

interface ParamsProps {
  params: Parameters[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Params = ({ params, handleChange }: ParamsProps) => {
  return (
    <>
      <h3 className={requestStyle.description}>Params</h3>
      {params.map((param, idx) => (
        <div className={requestStyle.inputBox} key={param.name}>
          <label className={requestStyle.label}>{param.name}</label>
          <label className={requestStyle.type}>
            {typeConverter(param.schema.type)}
          </label>
          <Input
            style={{ width: "40%", textAlign: "right" }}
            type={param.schema.type}
            name={param.name}
            placeholder={param.example + "" ?? ""}
            required={param.required}
            onChange={handleChange}
            defaultValue={
              param.required ? param.example ?? "" : param.schema.default ?? ""
            }
            autoFocus={idx === 0}
            onFocus={(e) => e.target.select()}
          />
        </div>
      ))}
    </>
  );
};

export default Params;
