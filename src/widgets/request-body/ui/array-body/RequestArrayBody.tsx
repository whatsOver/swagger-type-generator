import { Schemas } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import Input from "@/shared/ui/Input";
import { typeConverter } from "@/shared/util/typeConverter";
import { ChangeEvent } from "react";
import { requestArrayBodyStyles } from "./requestArrayBody.css";

interface RequestArrayBodyProps {
  body: Schemas;
  formValues: FormValues;
  idx: number;
  property: string;
  type: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addArrayItem: (key: string) => void;
  removeArrayItem: (key: string, index: number) => void;
}

export const RequestArrayBody = ({
  body,
  formValues,
  idx,
  property,
  type,
  addArrayItem,
  removeArrayItem,
  handleChange,
}: RequestArrayBodyProps) => {
  return (
    <>
      <div className={requestArrayBodyStyles.inputWrapper} key={property}>
        <div className={requestArrayBodyStyles.inputBox} key={property}>
          <label className={requestArrayBodyStyles.label}>{property}</label>
          <label className={requestArrayBodyStyles.type}>
            {typeConverter(body.properties[property].type)}
          </label>
          <div className={requestArrayBodyStyles.rightWrapper}>
            {type === "file" && (
              <label
                htmlFor="file"
                className={requestArrayBodyStyles.inputLabel}
              >
                <div className={requestArrayBodyStyles.uploadButton}>
                  Upload
                </div>
              </label>
            )}
            <Input
              style={{ width: "100%", textAlign: "right" }}
              type={type}
              name={property}
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
            {type !== "file" && (
              <button
                onClick={() => addArrayItem(property)}
                type="button"
                className={requestArrayBodyStyles.plusButton}
              >
                +
              </button>
            )}
          </div>
        </div>
        <div className={requestArrayBodyStyles.arrayBoxWrapper} key={property}>
          {(formValues[property] as string[])?.map((value, idx) => (
            <button
              onClick={() => removeArrayItem(property, idx)}
              className={requestArrayBodyStyles.arrayBlueBox}
              key={idx}
              type="button"
            >
              {typeof value === "string" ? value : (value as File).name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
