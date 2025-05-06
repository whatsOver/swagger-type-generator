import { SwaggerType } from "@/entities/swagger/types";
import {
  FormSchemaProperty, // Use the specific type for schema properties
} from "@/features/api-generate/module/hooks/useApiAddForm";
import CheckBox from "@/shared/ui/CheckBox";
import Dropdown from "@/shared/ui/Dropdown";
import Input from "@/shared/ui/Input";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { apiAddStyles } from "../ApiAdd.css"; // Reuse styles where applicable

// Define Swagger types for the dropdown (can be shared)
const SCHEMA_PROPERTY_TYPES: SwaggerType[] = [
  "string",
  "number",
  "integer",
  "boolean",
  "array",
  "object",
];

interface SchemaPropertyItemProps {
  item: FormSchemaProperty;
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    field: keyof Omit<FormSchemaProperty, "id">, // Fields from FormSchemaProperty
    value: any // Allow different types
  ) => void;
}

const SchemaPropertyItem: React.FC<SchemaPropertyItemProps> = ({
  item,
  onRemove,
  onChange,
}) => {
  // Use specific handlers for this item type
  const handleInputChange = (
    field: keyof Omit<FormSchemaProperty, "id">,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(item.id, field, event.target.value);
  };

  const handleDropdownChange = (
    field: keyof Omit<FormSchemaProperty, "id">,
    value: string
  ) => {
    onChange(item.id, field, value);
  };

  const handleCheckboxChange = (
    field: keyof Omit<FormSchemaProperty, "id">,
    isChecked: boolean
  ) => {
    onChange(item.id, field, isChecked);
  };

  return (
    // Reuse paramItem styles or create specific ones if needed
    <div key={item.id} className={`${apiAddStyles.paramItem} `}>
      {/* Name Input */}
      <Input
        placeholder="Name"
        value={item.name}
        onChange={(e) => handleInputChange("name", e)}
        className={apiAddStyles.inputFieldSmall}
      />

      {/* Type Dropdown */}
      <Dropdown>
        <Dropdown.Trigger
          as={
            <button className={apiAddStyles.paramTypeSelect}>
              <span>{item.type}</span>
              <BiChevronDown />
            </button>
          }
        />
        <Dropdown.Modal>
          {SCHEMA_PROPERTY_TYPES.map((type) => (
            <Dropdown.Item
              key={type}
              name={type}
              onClick={(name) => handleDropdownChange("type", name)}
            >
              {type}
            </Dropdown.Item>
          ))}
        </Dropdown.Modal>
      </Dropdown>

      {/* Format Input (Optional) */}
      <Input
        placeholder="Format"
        value={item.format || ""}
        onChange={(e) => handleInputChange("format", e)}
        className={apiAddStyles.inputFieldSmall}
      />

      {/* Description Input */}
      <Input
        placeholder="Description"
        value={item.description || ""}
        onChange={(e) => handleInputChange("description", e)}
        className={apiAddStyles.inputFieldSmall}
      />

      {/* Example Input */}
      <Input
        placeholder="Example"
        value={String(item.example || "")}
        onChange={(e) => handleInputChange("example", e)}
        className={apiAddStyles.inputFieldSmall}
      />

      {/* isRequired Checkbox */}
      <div className={apiAddStyles.checkboxContainer}>
        <CheckBox
          isChecked={item.isRequired}
          onChange={(checked) => handleCheckboxChange("isRequired", checked)}
        />
      </div>

      {/* Remove Button */}
      <button
        className={apiAddStyles.removeButton}
        onClick={() => onRemove(item.id)}
      >
        <IoMdClose className={apiAddStyles.removeIcon} />
      </button>
    </div>
  );
};

export default SchemaPropertyItem;
