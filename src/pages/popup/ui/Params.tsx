import React from "react";
import { requestStyle } from "./styles/request.css";
import Input from "@src/common/ui/Input";
import { Parameters } from "../api/docs";

interface ParamsProps {
  params: Parameters[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Params = ({ params, handleChange }: ParamsProps) => {
  return (
    <>
      <h3 className={requestStyle.description}>Params</h3>
      {params.map((param) => (
        <div className={requestStyle.inputBox} key={param.name}>
          <label className={requestStyle.label}>{param.name}</label>
          <label className={requestStyle.type}>{param.schema.type}</label>
          <Input
            style={{ width: "40%", textAlign: "right" }}
            type={param.schema.type}
            name={param.name}
            placeholder={param.example + "" ?? ""}
            required={param.required}
            onChange={handleChange}
          />
        </div>
      ))}
    </>
  );
};

export default Params;
