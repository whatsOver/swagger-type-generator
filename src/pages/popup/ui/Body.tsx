import React from "react";
import { requestStyle } from "./styles/request.css";
import { vars } from "@src/common/ui/styles/theme.css";
import { Schemas } from "../api/docs";
import Input from "@src/common/ui/Input";

interface BodyProps {
  body: Schemas;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Body = ({ body, handleChange }: BodyProps) => {
  return (
    <>
      <h3
        style={{ color: vars.color.blue }}
        className={requestStyle.description}
      >
        Body
      </h3>
      {Object.keys(body.properties).map((property) => (
        <div className={requestStyle.inputBox} key={property}>
          <label className={requestStyle.label}>{property}</label>
          <Input
            style={{ width: "40%", textAlign: "right" }}
            type={body.properties[property].type}
            name={property}
            required={body.required?.includes(property)}
            onChange={handleChange}
          />
        </div>
      ))}
    </>
  );
};

export default Body;
