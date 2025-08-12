import { useGETDocs } from "@/entities/swagger/api/get-document";
import { useSwaggerDocStore } from "@/entities/swagger/model/store/swaggerDocsStore";
import { Schemas } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import { vars } from "@/shared/ui/styles/theme.css";
import { typeConverter } from "@/shared/util/typeConverter";
import React, { ChangeEvent, useState } from "react";
import { RequestArrayBody } from "../array-body/RequestArrayBody";
import { RequestNormalBody } from "../normal-body/RequestNormalBody";
import { requestBodyStyles } from "./requestBody.css";

interface BodyProps {
  body: Schemas;
  formValues: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleArray: {
    addArrayItem: (key: string, value: string | File) => void;
    removeArrayItem: (key: string, index: number) => void;
  };
}

export const RequestBody = ({
  body,
  formValues,
  handleChange,
  handleArray: { addArrayItem, removeArrayItem },
}: BodyProps) => {
  // Array Param용 state
  // 기존에 custom hook으로 관리하던 paramState와 달리 하나의 input만 담당
  const [bodyValue, setBodyValue] = useState("");

  const { pathInfo } = useSwaggerDocStore();

  const { data: apiDocsData } = useGETDocs(pathInfo);

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

  const isFileType = (property: string) => {
    // 직접 프로퍼티의 format이 binary인 경우
    if (body.properties[property]?.format === "binary") {
      return true;
    }
    // 배열 아이템의 format이 binary인 경우
    if (body.properties[property]?.items?.format === "binary") {
      return true;
    }
    return false;
  };

  const getType = (property: string) => {
    const propertySchema = body.properties[property];
    if (!propertySchema) {
      return "unknown";
    }

    // 직접적인 타입이 있는 경우
    if (propertySchema.type) {
      return typeConverter(propertySchema.type);
    }

    // $ref 참조가 있는 경우
    const fullRef = propertySchema.$ref;
    if (!fullRef) {
      return "unknown";
    }

    const ref = fullRef.split("/").pop();
    if (!ref || !apiDocsData?.components?.schemas) {
      return "unknown";
    }

    const schema = apiDocsData.components.schemas[ref];
    return schema?.type ? typeConverter(schema.type) : "unknown";
  };

  return (
    <>
      <h3
        style={{ color: vars.color.blue }}
        className={requestBodyStyles.description}
      >
        Body
      </h3>
      {Object.keys(body.properties).map((property, idx) => (
        <>
          {body.properties[property].type === "array" ? (
            <RequestArrayBody
              body={body}
              formValues={formValues}
              handleChange={onChangeBodyValue}
              idx={idx}
              property={property}
              addArrayItem={onAddArrayItem}
              removeArrayItem={removeArrayItem}
              type={getType(property)}
              isFileType={isFileType(property)}
            />
          ) : (
            <RequestNormalBody
              body={body}
              formValues={formValues}
              handleChange={handleChange}
              idx={idx}
              property={property}
              type={getType(property)}
              isFileType={isFileType(property)}
            />
          )}
        </>
      ))}
    </>
  );
};
