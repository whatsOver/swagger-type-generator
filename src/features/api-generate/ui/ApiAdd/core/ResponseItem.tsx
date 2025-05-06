import { ContentType } from "@/entities/swagger/types";
import {
  FormResponse,
  FormSchemaProperty,
} from "@/features/api-generate/module/hooks/useApiAddForm"; // Import types
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Input from "@/shared/ui/Input";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { apiAddStyles } from "../ApiAdd.css";
import { SchemaPropertiesList } from "./SchemaPropertiesList"; // Import reusable list

const RESPONSE_CONTENT_TYPES: ContentType[] = ["application/json"];

interface ResponseItemProps {
  response: FormResponse;
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

export const ResponseItem: React.FC<ResponseItemProps> = ({
  response,
  onRemoveResponse,
  onResponseChange,
  onAddSchemaProp,
  onRemoveSchemaProp,
  onSchemaPropChange,
}) => {
  // Curried change handler for schema properties within this specific response
  const handleSchemaPropChangeForThisResponse = (
    propId: string,
    field: keyof Omit<FormSchemaProperty, "id">,
    value: any
  ) => {
    onSchemaPropChange(response.id, propId, field, value);
  };

  const handleRemoveSchemaPropForThisResponse = (propId: string) => {
    onRemoveSchemaProp(response.id, propId);
  };

  return (
    <div key={response.id} className={apiAddStyles.responseItemContainer}>
      <div className={apiAddStyles.responseHeader}>
        <div className={apiAddStyles.responseMetaInputGroup}>
          <div className={apiAddStyles.responseMetaItem}>
            <span className={apiAddStyles.labelSmall}>Status Code *</span>
            <Input
              type="number"
              placeholder="e.g., 200"
              value={response.statusCode}
              onChange={(e) =>
                onResponseChange(response.id, "statusCode", e.target.value)
              }
              className={apiAddStyles.inputFieldSmall}
            />
          </div>
          <div className={apiAddStyles.responseMetaItemWide}>
            <span className={apiAddStyles.labelSmall}>Description *</span>
            <Input
              placeholder="e.g., OK, Not Found"
              value={response.description}
              onChange={(e) =>
                onResponseChange(response.id, "description", e.target.value)
              }
              className={apiAddStyles.inputField}
            />
          </div>
        </div>
        <button
          className={apiAddStyles.removeButton}
          onClick={() => onRemoveResponse(response.id)}
          title="Remove this response"
        >
          <IoMdClose className={apiAddStyles.removeIcon} />
        </button>
      </div>

      <div className={apiAddStyles.responseContentType}>
        <span className={apiAddStyles.labelSmall}>Content Type</span>
        <Dropdown>
          <Dropdown.Trigger
            as={
              <button
                className={apiAddStyles.paramTypeSelect}
                style={{ width: "100%" }}
              >
                <span>{response.contentType}</span>
                <BiChevronDown />
              </button>
            }
          ></Dropdown.Trigger>
          <Dropdown.Modal>
            {RESPONSE_CONTENT_TYPES.map((ctype) => (
              <Dropdown.Item
                key={ctype}
                name={ctype}
                onClick={(name) =>
                  onResponseChange(response.id, "contentType", name)
                }
              >
                {ctype}
              </Dropdown.Item>
            ))}
          </Dropdown.Modal>
        </Dropdown>
      </div>

      <div className={apiAddStyles.schemaPropertiesSection}>
        <div className={apiAddStyles.schemaPropertiesHeader}>
          <span
            className={apiAddStyles.labelSmall}
            style={{ fontWeight: "bold" }}
          >
            Schema Properties
          </span>
          <Button
            color="green"
            onClick={() => onAddSchemaProp(response.id)}
            // size="xsmall" // Use if available in your Button component
          >
            + Add Property
          </Button>
        </div>
        {/* Use the reusable SchemaPropertiesList */}
        <SchemaPropertiesList
          properties={response.schemaProperties ?? []}
          onRemove={handleRemoveSchemaPropForThisResponse}
          onChange={handleSchemaPropChangeForThisResponse}
        />
      </div>
    </div>
  );
};
