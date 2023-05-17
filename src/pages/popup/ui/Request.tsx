import { Parameters, Schemas } from "../api/docs";
import { requestStyle } from "./styles/request.css";
import axios, { Method } from "axios";
import { useState } from "react";
import Input from "@src/common/ui/Input";
import { ChangeEvent } from "react";
import { FormEvent } from "react";
import Button from "@src/common/ui/Button";
import { vars } from "@src/common/ui/styles/theme.css";
import { useLocation } from "react-router-dom";
import { popupStyle } from "../styles/popup.css";
import Header from "@src/common/ui/Header";
import Modal from "@src/common/ui/Modal";
import { getBody, getQueryParams } from "../util/request";

export interface RequestProps {
  method: Method;
  path: string;
  params: Parameters[];
  body?: Schemas;
}

const Request = () => {
  const { method, params, path, body } = useLocation().state as RequestProps;

  const [formValues, setFormValues] = useState({});

  const [response, setResponse] = useState(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const transformPath = params.reduce((acc, param) => {
      return param.in === "path"
        ? acc.replace(`{${param.name}}`, formValues[param.name])
        : acc;
    }, path);

    try {
      const response = await axios({
        method,
        url: "http://localhost:8080" + transformPath,
        params: getQueryParams(params, formValues) ?? {},
        data: body ? getBody(body, formValues) : {},
      });
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className={popupStyle.app}>
        <form className={requestStyle.body} onSubmit={handleSubmit}>
          {params && (
            <>
              <h3 className={requestStyle.description}>Params</h3>
              {params?.map((param) => (
                <div className={requestStyle.inputBox} key={param.name}>
                  <label className={requestStyle.label}>{param.name}</label>
                  <label className={requestStyle.type}>
                    {param.schema.type}
                  </label>
                  <Input
                    style={{ width: "40%", textAlign: "right" }}
                    type={param.schema.type}
                    name={param.name}
                    placeholder={param.example + "" ?? ""}
                    required={param.required}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </>
          )}

          {body && (
            <>
              <h3
                style={{ color: vars.color.blue }}
                className={requestStyle.description}
              >
                Body
              </h3>
              {Object.keys(body.properties).map((property) => (
                <div className={requestStyle.inputBox} key={property}>
                  <label className={requestStyle.label}>{property}</label>
                  <Input
                    style={{ width: "40%", textAlign: "right" }}
                    type={body.properties[property].type}
                    name={property}
                    required={body.required?.includes(property)}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </>
          )}
          <div className={requestStyle.buttonWrapper}>
            <Modal>
              <Modal.Trigger
                as={
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  <Button onClick={() => {}} type="submit">
                    SUBMIT
                  </Button>
                }
              />
              <Modal.Content>
                {response && (
                  <div className={requestStyle.modal}>
                    <div className={requestStyle.response}>
                      <h3 className={requestStyle.description}>Response</h3>
                      <pre className={requestStyle.responseBody}>
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </Modal.Content>
            </Modal>
          </div>
        </form>
      </div>
    </>
  );
};

export default Request;
