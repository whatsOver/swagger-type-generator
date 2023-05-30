import { Parameters, Schemas } from "../api/docs";
import { requestStyle } from "./styles/request.css";
import axios, { Method } from "axios";
import { useState, FormEvent, useRef, useEffect, useCallback } from "react";
import Button from "@src/common/ui/Button";
import { useLocation } from "react-router-dom";
import { popupStyle } from "../styles/popup.css";
import Header from "@src/common/ui/Header";
import Modal from "@src/common/ui/Modal";
import { getBody, getQueryParams } from "../util/request";
import Params from "./Params";
import Body from "./Body";
import { jsonToTs } from "@src/common/util/typeGenerator";
import useCopy from "../hooks/useCopy";
import ModalCodeBlock from "./ModalCodeBlock";
import { Flip, ToastContainer } from "react-toastify";
import { generateAPICode, generateInterface } from "../util/apiGenerator";
import useForm from "../hooks/useForm";
import "react-toastify/dist/ReactToastify.css";

export interface RequestProps {
  method: Method;
  path: string;
  params: Parameters[];
  description: string;
  host: string;
  body?: Schemas;
}

export type Mode = "REQUEST" | "TS" | "ERROR" | "API";

const Request = () => {
  // FIRST RENDER
  const { method, params, path, body, host, description } = useLocation()
    .state as RequestProps;

  // INTERACTION
  // 1. 유저 > params, body 입력
  const { formValues, handleChange, setFormValues } = useForm();

  // 1-1. 유저 > params, body 입력 > 초기값 설정
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialValues: Record<string, any> = {};
    params?.forEach((param) => {
      if (param.example && param.required) {
        initialValues[param.name] = param.example;
      }
    });
    body?.required?.forEach((key) => {
      if (body.properties[key]?.example) {
        initialValues[key] = body.properties[key].example;
      }
    });
    setFormValues(initialValues);
  }, [params, body, setFormValues]);

  // 2. 유저 > 요청 버튼 클릭
  const [response, setResponse] = useState(null);
  // 2-1. 유저 > 요청 버튼 클릭 > 요청 보내기
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
        url: host + transformPath,
        params: getQueryParams(params, formValues) ?? {},
        data: body ? getBody(body, formValues) : {},
      });
      setResponse(response.data);
    } catch (error) {
      setMode("ERROR");
      setResponse(error.response.data);
    }
  };

  // 3. 유저 > TS 버튼 클릭
  const [mode, setMode] = useState<Mode>("REQUEST");

  const onClickTS = () => {
    setMode("TS");
    setCode(jsonToTs("json", response).join("\n"));
  };

  // 4. code 상태 관리
  const [code, setCode] = useState<string>("");

  // 4. 유저 > API 버튼 클릭
  const onClickAPI = () => {
    setMode("API");
    setCode(jsonToTs("json", response).join("\n"));
    setCode(
      (prev) =>
        prev +
        "\n\n" +
        (generateInterface(params) +
          "\n" +
          generateAPICode({
            api: { method, path, host, params, body },
            formValues,
          }))
    );
  };

  // 4. 유저 > 복사 버튼 클릭
  const codeRef = useRef(null);
  const { copyToClipboard } = useCopy({ codeRef });

  // 5. 모달 닫기
  const onCloseModal = () => {
    // modal 애니메이션 끝나고 mode 변경
    setTimeout(() => {
      setMode("REQUEST");
    }, 500);
  };

  const initializeMode = useCallback(() => setMode("REQUEST"), []);

  return (
    <>
      <Header />
      <div className={popupStyle.app}>
        <form className={requestStyle.body} onSubmit={handleSubmit}>
          <h2 className={requestStyle.mainDescription}>{description}</h2>
          {params && <Params params={params} handleChange={handleChange} />}
          {body && <Body body={body} handleChange={handleChange} />}
          <div className={requestStyle.fixedButtonWrapper}>
            <Modal>
              <Modal.Trigger
                as={
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  <Button onClick={() => {}} type="submit">
                    SUBMIT
                  </Button>
                }
              />
              <Modal.Content onClose={onCloseModal}>
                {response && mode === "REQUEST" && (
                  <ModalCodeBlock
                    description="Response"
                    code={JSON.stringify(response, null, 2)}
                    mode="REQUEST"
                    ref={codeRef}
                    onClose={onCloseModal}
                    onClickCopy={copyToClipboard}
                    onClickTS={onClickTS}
                    onClickAPI={onClickAPI}
                  />
                )}
                {mode === "TS" && (
                  <ModalCodeBlock
                    description="Type"
                    code={code}
                    mode="TS"
                    ref={codeRef}
                    onClickBack={initializeMode}
                    onClickCopy={copyToClipboard}
                  />
                )}
                {mode === "ERROR" && (
                  <ModalCodeBlock
                    description="Error"
                    descriptionColor="red"
                    code={JSON.stringify(response, null, 2)}
                    mode="ERROR"
                    ref={codeRef}
                    onClickBack={initializeMode}
                    onClickCopy={copyToClipboard}
                  />
                )}
                {mode === "API" && (
                  <ModalCodeBlock
                    description="API"
                    descriptionColor="red"
                    code={code}
                    mode="API"
                    ref={codeRef}
                    onClickBack={initializeMode}
                    onClickCopy={copyToClipboard}
                  />
                )}
              </Modal.Content>
            </Modal>
          </div>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          theme="dark"
          transition={Flip}
        />
      </div>
    </>
  );
};

export default Request;
