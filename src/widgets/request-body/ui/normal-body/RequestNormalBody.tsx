import { Schemas } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import Input from "@/shared/ui/Input";
import { typeConverter } from "@/shared/util/typeConverter";
import { ChangeEvent } from "react";
import { requestNormalBodyStyles } from "./requestNormalBody.css";

interface RequestNormalBodyProps {
  body: Schemas;
  formValues: FormValues;
  idx: number;
  property: string;
  type: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const RequestNormalBody = ({
  body,
  formValues,
  idx,
  property,
  type,
  handleChange,
}: RequestNormalBodyProps) => {
  return (
    <>
      <div className={requestNormalBodyStyles.inputWrapper} key={property}>
        <div className={requestNormalBodyStyles.inputBox} key={property}>
          <label className={requestNormalBodyStyles.label}>{property}</label>
          <label className={requestNormalBodyStyles.type}>
            {typeConverter(body.properties[property].type)}
          </label>
          {type === "file" && (
            <label
              htmlFor="file"
              className={requestNormalBodyStyles.inputLabel}
            >
              <div className={requestNormalBodyStyles.uploadButton}>Upload</div>
            </label>
          )}
          <Input
            style={{ width: "40%", textAlign: "right" }}
            type={type}
            name={property}
            value={formValues[property] as string}
            placeholder={
              body.properties[property].example !== undefined
                ? body.properties[property].example + ""
                : ""
            }
            required={body.required?.includes(property)}
            onChange={handleChange}
            defaultValue={
              body.properties[property].example
                ? body.properties[property].example
                : body.properties[property].default ?? ""
            }
            id="file"
            autoFocus={idx === 0}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </>
  );
};
