import { SwaggerType } from "@/entities/swagger/types";
import { FormParam } from "@/features/api-generate/module/hooks/useApiAddForm";
import CheckBox from "@/shared/ui/CheckBox";
import Dropdown from "@/shared/ui/Dropdown";
import Input from "@/shared/ui/Input";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { apiAddStyles } from "../ApiAdd.css";

const PARAM_IN_OPTIONS = ["query", "path", "header", "cookie"];
const PARAM_TYPES: SwaggerType[] = [
  "string",
  "number",
  "boolean",
  "array",
  "object",
];

interface ParamItemProps {
  item: FormParam;
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    field: keyof Omit<FormParam, "id">,
    value: any
  ) => void;
}

const ParamItem: React.FC<ParamItemProps> = ({ item, onRemove, onChange }) => {
  const handleInputChange = (
    field: keyof Omit<FormParam, "id">,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(item.id, field, event.target.value);
  };

  const handleDropdownChange = (
    field: keyof Omit<FormParam, "id">,
    value: string
  ) => {
    onChange(item.id, field, value);
  };

  const handleCheckboxChange = (
    field: keyof Omit<FormParam, "id">,
    isChecked: boolean
  ) => {
    onChange(item.id, field, isChecked);
  };

  return (
    <div key={item.id} className={`${apiAddStyles.paramItem}`}>
      <Input
        placeholder="Name"
        value={item.name}
        onChange={(e) => handleInputChange("name", e)}
        className={apiAddStyles.inputFieldSmall}
      />

      <Dropdown>
        <Dropdown.Trigger
          as={
            <button className={apiAddStyles.paramTypeSelect}>
              <span>{item.in}</span>
              <BiChevronDown />
            </button>
          }
        />
        <Dropdown.Modal>
          {PARAM_IN_OPTIONS.map((inType) => (
            <Dropdown.Item
              key={inType}
              name={inType}
              onClick={(name) => handleDropdownChange("in", name)}
            >
              {inType}
            </Dropdown.Item>
          ))}
        </Dropdown.Modal>
      </Dropdown>

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
          {PARAM_TYPES.map((type) => (
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

      <Input
        placeholder="Description"
        value={item.description}
        onChange={(e) => handleInputChange("description", e)}
        className={apiAddStyles.inputFieldSmall}
      />

      <Dropdown>
        <Dropdown.Trigger
          as={
            <button className={apiAddStyles.paramTypeSelect}>
              <span className={apiAddStyles.paramText}>{item.format}</span>
              <BiChevronDown />
            </button>
          }
        />
        <Dropdown.Modal>
          {PARAM_TYPES.map((type) => (
            <Dropdown.Item
              key={type}
              name={type}
              onClick={(name) => handleDropdownChange("format", name)}
            >
              {type}
            </Dropdown.Item>
          ))}
        </Dropdown.Modal>
      </Dropdown>

      <div className={apiAddStyles.checkboxContainer}>
        <CheckBox
          isChecked={item.required}
          onChange={(checked) => handleCheckboxChange("required", checked)}
        />
      </div>

      <button
        className={apiAddStyles.removeButton}
        onClick={() => onRemove(item.id)}
      >
        <IoMdClose className={apiAddStyles.removeIcon} />
      </button>
    </div>
  );
};

export default ParamItem;
