import { ContentType, Parameters, Schemas } from "../api/docs";
import { requestStyle } from "./styles/request.css";
import { Method } from "axios";
import { useState, useCallback } from "react";
import Button from "@src/common/ui/Button";
import { useLocation } from "react-router-dom";
import { popupStyle } from "../styles/popup.css";
import Header from "@src/common/ui/Header";
import Modal from "@src/common/ui/Modal";
import Params from "./Params";
import Body from "./Body";
import ModalCodeBlock from "./ModalCodeBlock";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HashLoader from "react-spinners/HashLoader";
import { VscBracketError as ErrorIcon } from "react-icons/vsc";
import { vars } from "@src/common/ui/styles/theme.css";
import useHandleRequest from "../hooks/Request/useHandleRequest";
import useHandleCode from "../hooks/Request/useHandleCode";

export interface RequestProps {
  method: Method;
  path: string;
  params: Parameters[];
  description: string;
  host: string;
  contentType: ContentType;
  body?: Schemas;
}

export type Mode = "REQUEST" | "TS" | "ERROR" | "AXIOS" | "FETCH" | "LOADING";

const Request = () => {
  // FIRST RENDER
  const { params, body, description } = useLocation().state as RequestProps;

  // INTERACTION
  // 1. mode 상태 관리
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

  // 2. Request 비지니스 로직
  const { response, formValues, handleChange, handleSubmit, handleArray } =
    useHandleRequest({
      setMode,
    });

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
            <Params
              params={params}
              formValues={formValues}
              handleChange={handleChange}
              handleArray={handleArray}
            />
          )}
          {!!body?.type.length && (
            <Body
              body={body}
              formValues={formValues}
              handleChange={handleChange}
              handleArray={handleArray}
            />
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
