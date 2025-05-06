import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import { Method } from "axios";
import React from "react";
import { apiAddStyles } from "../ApiAdd.css";

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface HttpMethodSelectorProps {
  method: Method;
  setMethod: (method: Method) => void;
}

export const HttpMethodSelector: React.FC<HttpMethodSelectorProps> = ({
  method,
  setMethod,
}) => {
  return (
    <div className={apiAddStyles.methodRow}>
      <span className={apiAddStyles.label}>HTTP Method</span>
      <Dropdown>
        <Dropdown.Trigger
          as={
            <Button color="purple" style={{ width: "100%" }}>
              <span className={apiAddStyles.selectText}>{method}</span>
            </Button>
          }
        />
        <Dropdown.Modal>
          {HTTP_METHODS.map((methodItem) => (
            <Dropdown.Item
              key={methodItem}
              name={methodItem}
              onClick={(name) => setMethod(name as Method)}
            >
              {methodItem}
            </Dropdown.Item>
          ))}
        </Dropdown.Modal>
      </Dropdown>
    </div>
  );
};
