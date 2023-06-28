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
import { Flip, ToastContainer, toast } from "react-toastify";
import {
  generateAxiosAPICode,
  generateFetchAPICode,
  generateInterface,
} from "../util/apiGenerator";
import useForm from "../hooks/useForm";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../store/auth";
import { EMPTY_RESPONSE } from "../constants/status";
import HashLoader from "react-spinners/HashLoader";
import { VscBracketError as ErrorIcon } from "react-icons/vsc";
import { vars } from "@src/common/ui/styles/theme.css";

export interface RequestProps {
  method: Method;
  path: string;
  params: Parameters[];
  description: string;
  host: string;
  body?: Schemas;
}

export type Mode = "REQUEST" | "TS" | "ERROR" | "AXIOS" | "FETCH" | "LOADING";

const Request = () => {
  // FIRST RENDER
  const { method, params, path, body, host, description } = useLocation()
    .state as RequestProps;

  const token = useAuthStore((state) => state.token);

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
      if (param.schema?.default) {
        initialValues[param.name] = param.schema.default;
      }
    });
    body?.properties &&
      Object.keys(body.properties).forEach((key) => {
        if (body.properties[key].example) {
          initialValues[key] = body.properties[key].example;
        }
        if (body.properties[key].default) {
          initialValues[key] = body.properties[key].default;
        }
      });
    setFormValues(initialValues);
  }, [params, body, setFormValues]);

  // 2. 유저 > 요청 버튼 클릭
  const [response, setResponse] = useState(null);

  // 2-1. 유저 > 요청 버튼 클릭 > 요청 보내기
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setMode("LOADING");
    e.preventDefault();
    const transformPath = params
      ? params.reduce((acc, param) => {
          return param.in === "path"
            ? acc.replace(`{${param.name}}`, formValues[param.name])
            : acc;
        }, path)
      : path;
    try {
      const headers = token.length ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios({
        method,
        url: host + transformPath,
        params: params ? getQueryParams(params, formValues) : {},
        data: body ? getBody(body, formValues) : {},
        headers,
      });
      if (!response.data) {
        toast.success(`${response.status} ${response.statusText}`);
        setResponse(EMPTY_RESPONSE);
        return;
      }
      toast.success(`${response.status} ${response.statusText}`);
      setResponse(response.data);
      setMode("REQUEST");
    } catch (error) {
      setMode("ERROR");
      toast.error(`${error.response.status} ${error.response.statusText}`);
      setResponse(error.response.data);
    }
  };

  // 3. 유저 > TS 버튼 클릭
  const [mode, setMode] = useState<Mode>("REQUEST");
  // 2. modal 닫기
  const onCloseModal = () => {
    // modal 애니메이션 끝나고 mode 변경
    setTimeout(() => {
      setMode("REQUEST");
    }, 500);
  };
  // 3. modal 상태 초기화
  const initializeMode = useCallback(() => setMode("REQUEST"), []);

  // 3. Code 비지니스 로직
  const {
    code,
    codeRef,
    copyToClipboard,
    onClickAxios,
    onClickFetch,
    onClickTS,
  } = useHandleCode({ response, setMode });

  return (
    <div className={popupStyle.app}>
      <Header />
      <form className={requestStyle.body} onSubmit={handleSubmit}>
        <h2 className={requestStyle.mainDescription}>{description}</h2>
        <div className={requestStyle.requestBlock}>
          {!!params?.length && (
            <Params params={params} handleChange={handleChange} />
          )}
          {!!body?.type.length && (
            <Body body={body} handleChange={handleChange} />
          )}
          {!params?.length && !body?.type.length && (
            <div className={requestStyle.flexView}>
              <ErrorIcon size={26} color={vars.color.green} />
              <span className={requestStyle.description}>
                No parameters or body
              </span>
            </div>
          )}
        </div>
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
            <Modal.Content>
              {mode === "LOADING" && <HashLoader color="#36d7b7" />}
              {response && mode === "REQUEST" && (
                <ModalCodeBlock
                  description="Response"
                  code={JSON.stringify(response, null, 2)}
                  mode="REQUEST"
                  ref={codeRef}
                  onClose={onCloseModal}
                  onClickCopy={copyToClipboard}
                  onClickTS={onClickTS}
                  onClickAxios={onClickAxios}
                  onClickFetch={onClickFetch}
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
              {mode === "AXIOS" && (
                <ModalCodeBlock
                  description="AXIOS"
                  descriptionColor="red"
                  code={code}
                  mode="AXIOS"
                  ref={codeRef}
                  onClickBack={initializeMode}
                  onClickCopy={copyToClipboard}
                />
              )}
              {mode === "FETCH" && (
                <ModalCodeBlock
                  description="FETCH"
                  descriptionColor="orange"
                  code={code}
                  mode="FETCH"
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
  );
};

export default Request;
