import React from "react";
import { requestStyle } from "./styles/request.css";
import { vars } from "@src/common/ui/styles/theme.css";
import { Schemas } from "../api/docs";
import Input from "@src/common/ui/Input";
import { typeConverter } from "../util/typeConverter";

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
      {Object.keys(body.properties).map((property, idx) => (
        <div className={requestStyle.inputBox} key={property}>
          <label className={requestStyle.label}>{property}</label>
          <label className={requestStyle.bodyType}>
            {typeConverter(body.properties[property].type)}
          </label>
          <Input
            autoFocus={idx === 0}
            style={{ width: "40%", textAlign: "right" }}
            type={body.properties[property].type}
            name={property}
            required={body.required?.includes(property)}
            onChange={handleChange}
            defaultValue={body.properties[property].example ?? ""}
            onFocus={(e) => e.target.select()}
          />
        </div>
      ))}
    </>
  );
};

export default Body;
