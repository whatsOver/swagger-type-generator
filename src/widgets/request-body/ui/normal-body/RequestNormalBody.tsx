import { Schemas } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import Input from "@/shared/ui/Input";
import { ChangeEvent } from "react";
import { requestNormalBodyStyles } from "./requestNormalBody.css";

interface RequestNormalBodyProps {
  body: Schemas;
  formValues: FormValues;
  idx: number;
  property: string;
  isFileType: boolean;
  type: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const RequestNormalBody = ({
  body,
  formValues,
  idx,
  property,
  isFileType,
  type,
  handleChange,
}: RequestNormalBodyProps) => {
  const placeholder =
    body.properties[property].example !== undefined
      ? body.properties[property].example + ""
      : "";

  const defaultValue = body.properties[property].example
    ? body.properties[property].example
    : body.properties[property].default ?? "";
  return (
    <>
      <div className={requestNormalBodyStyles.inputWrapper} key={property}>
        <div className={requestNormalBodyStyles.inputBox} key={property}>
          <label className={requestNormalBodyStyles.label}>{property}</label>
          <label className={requestNormalBodyStyles.type}>{type}</label>
          {!!isFileType && (
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
            placeholder={placeholder}
            required={body.required?.includes(property)}
            onChange={handleChange}
            defaultValue={defaultValue}
            id="file"
            autoFocus={idx === 0}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </>
  );
};
