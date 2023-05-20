import { Parameters, Schemas } from "../api/docs";
import { requestStyle } from "./styles/request.css";
import axios, { Method } from "axios";
import { useState, ChangeEvent, FormEvent, useRef } from "react";
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
import "react-toastify/dist/ReactToastify.css";

export interface RequestProps {
  method: Method;
  path: string;
  params: Parameters[];
  body?: Schemas;
}

type Mode = "REQUEST" | "TS" | "ERROR";

const Request = () => {
  // FIRST RENDER
  const { method, params, path, body } = useLocation().state as RequestProps;

  // INTERACTION
  // 1. 유저 > params, body 입력
  const [formValues, setFormValues] = useState({});
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
        url: "http://localhost:8080" + transformPath,
        params: getQueryParams(params, formValues) ?? {},
        data: body ? getBody(body, formValues) : {},
      });
      setResponse(response.data);
    } catch (error) {
      setMode("ERROR");
      setResponse(error.response.data);
      console.log(error);
    }
  };

  // 3. 유저 > TS 버튼 클릭
  const [mode, setMode] = useState<Mode>("REQUEST");
  const [type, setType] = useState(null);
  const onClickTS = () => {
    setMode("TS");
    setType(jsonToTs("json", response).join("\n"));
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

  return (
    <>
      <Header />
      <div className={popupStyle.app}>
        <form className={requestStyle.body} onSubmit={handleSubmit}>
          {params && <Params params={params} handleChange={handleChange} />}
          {body && <Body body={body} handleChange={handleChange} />}
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
              <Modal.Content onClose={onCloseModal}>
                {response && mode === "REQUEST" && (
                  <ModalCodeBlock
                    description="Response"
                    code={JSON.stringify(response, null, 2)}
                    ref={codeRef}
                    onClickCopy={copyToClipboard}
                    onClickTS={onClickTS}
                  />
                )}
                {mode === "TS" && (
                  <ModalCodeBlock
                    description="Type"
                    code={type}
                    ref={codeRef}
                    onClickCopy={copyToClipboard}
                  />
                )}
                {mode === "ERROR" && (
                  <ModalCodeBlock
                    description="Error"
                    descriptionColor="red"
                    code={JSON.stringify(response, null, 2)}
                    ref={codeRef}
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
