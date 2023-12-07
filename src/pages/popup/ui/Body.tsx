import React, { ChangeEvent, useState } from "react";
import { requestStyle } from "./styles/request.css";
import { vars } from "@src/common/ui/styles/theme.css";
import { Schemas } from "../api/docs";
import Input from "@src/common/ui/Input";
import { typeConverter } from "../util/typeConverter";
import { FormValues } from "../hooks/useForm";

interface BodyProps {
  body: Schemas;
  formValues: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleArray: {
    addArrayItem: (key: string, value: string | File) => void;
    removeArrayItem: (key: string, index: number) => void;
  };
}

const Body = ({
  body,
  formValues,
  handleChange,
  handleArray: { addArrayItem, removeArrayItem },
}: BodyProps) => {
  // Array Param용 state
  // 기존에 custom hook으로 관리하던 paramState와 달리 하나의 input만 담당
  const [bodyValue, setBodyValue] = useState("");

  const onChangeBodyValue = (e: ChangeEvent<HTMLInputElement>) => {
    // file type일 경우 직접 addArrayItem 호출
    if (e.target.id === "file" && e.target.files) {
      addArrayItem(e.target.name, e.target.files[0]);
      return;
    }
    setBodyValue(e.target.value);
  };

  const onAddArrayItem = (key: string) => {
    addArrayItem(key, bodyValue);
    setBodyValue("");
  };

  const isItemsTypeFile = (property: string) => {
    return body.properties[property].items?.format === "binary"
      ? "file"
      : "text";
  };

  return (
    <>
      <h3
        style={{ color: vars.color.blue }}
        className={requestStyle.description}
      >
        Body
      </h3>
      {Object.keys(body.properties).map((property, idx) => (
        <>
          {body.properties[property].type === "array" ? (
            <ArrayBody
              body={body}
              formValues={formValues}
              handleChange={onChangeBodyValue}
              idx={idx}
              property={property}
              addArrayItem={onAddArrayItem}
              removeArrayItem={removeArrayItem}
              type={isItemsTypeFile(property)}
            />
          ) : (
            <NormalBody
              body={body}
              formValues={formValues}
              handleChange={handleChange}
              idx={idx}
              property={property}
              type={isItemsTypeFile(property)}
            />
          )}
        </>
      ))}
    </>
  );
};

export default Body;

interface NormalBodyProps {
  body: Schemas;
  formValues: FormValues;
  idx: number;
  property: string;
  type: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const NormalBody = ({
  body,
  formValues,
  idx,
  property,
  type,
  handleChange,
}: NormalBodyProps) => {
  return (
    <>
      <div className={requestStyle.inputWrapper} key={property}>
        <div className={requestStyle.inputBox} key={property}>
          <label className={requestStyle.label}>{property}</label>
          <label className={requestStyle.type ?? ""}>
            {typeConverter(body.properties[property].type)}
          </label>
          {type === "file" && (
            <label htmlFor="file" className={requestStyle.inputLabel}>
              Upload
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
            autoFocus={idx === 0}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </>
  );
};

interface ArrayBodyProps {
  body: Schemas;
  formValues: FormValues;
  idx: number;
  property: string;
  type: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addArrayItem: (key: string) => void;
  removeArrayItem: (key: string, index: number) => void;
}

const ArrayBody = ({
  body,
  formValues,
  idx,
  property,
  type,
  addArrayItem,
  removeArrayItem,
  handleChange,
}: ArrayBodyProps) => {
  console.log(type);
  return (
    <>
      <div className={requestStyle.inputWrapper} key={property}>
        <div className={requestStyle.inputBox} key={property}>
          <label className={requestStyle.label}>{property}</label>
          <label className={requestStyle.type ?? ""}>
            {typeConverter(body.properties[property].type)}
          </label>
          <div className={requestStyle.rightWrapper}>
            {type === "file" && (
              <label htmlFor="file" className={requestStyle.inputLabel}>
                <div className={requestStyle.uploadButton}>Upload</div>
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
                className={requestStyle.plusButton}
              >
                +
              </button>
            )}
          </div>
        </div>
        <div className={requestStyle.arrayBoxWrapper} key={property}>
          {(formValues[property] as string[])?.map((value, idx) => (
            <button
              onClick={() => removeArrayItem(property, idx)}
              className={requestStyle.arrayBlueBox}
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
