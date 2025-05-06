import {
  FormResponse,
  FormSchemaProperty,
} from "@/features/api-generate/module/hooks/useApiAddForm"; // Import types
import React from "react";
import { ResponseItem } from "./ResponseItem"; // Import the item component

interface ResponsesSectionContentProps {
  responses: FormResponse[];
  onRemoveResponse: (id: string) => void;
  onResponseChange: (
    id: string,
    field: keyof Omit<FormResponse, "id" | "schemaProperties">,
    value: any
  ) => void;
  onAddSchemaProp: (responseId: string) => void;
  onRemoveSchemaProp: (responseId: string, propId: string) => void;
  onSchemaPropChange: (
    responseId: string,
    propId: string,
    field: keyof Omit<FormSchemaProperty, "id">,
    value: any
  ) => void;
}

export const ResponsesSectionContent: React.FC<
  ResponsesSectionContentProps
> = ({
  responses,
  onRemoveResponse,
  onResponseChange,
  onAddSchemaProp,
  onRemoveSchemaProp,
  onSchemaPropChange,
}) => {
  return (
    <>
      {responses.map((response) => (
        <ResponseItem
          key={response.id}
          response={response}
          onRemoveResponse={onRemoveResponse}
          onResponseChange={onResponseChange}
          onAddSchemaProp={onAddSchemaProp}
          onRemoveSchemaProp={onRemoveSchemaProp}
          onSchemaPropChange={onSchemaPropChange}
        />
      ))}
    </>
  );
};
