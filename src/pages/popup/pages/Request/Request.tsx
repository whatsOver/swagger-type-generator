import { APIWithParamsAndBodyAndHost } from "@/pages/content/modules/getApiList2";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import Modal from "@/shared/ui/Modal";
import { vars } from "@/shared/ui/styles/theme.css";
import { useCallback, useState } from "react";
import { VscBracketError as ErrorIcon } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useHandleRequest from "../../../../features/request-api/module/hooks/useHandleRequest";
import useHandleCode from "../../hooks/Request/useHandleCode";
import Body from "../../ui/Body";
import ModalCodeBlock from "../../ui/CodeBlockView";
import Params from "../../ui/Params";
import Loading from "../../ui/loading/Loading";
import { popupStyle } from "../Popup/ui/popup.css";
import { requestStyle } from "./request.css";

export type Mode = "RESPONSE" | "TS" | "ERROR" | "AXIOS" | "FETCH" | "LOADING";

const Request = () => {
  // FIRST RENDER
  const api = useLocation().state as APIWithParamsAndBodyAndHost;
  const { description, params, body } = api;

  // INTERACTION
  // 1. mode 상태 관리
  const [mode, setMode] = useState<Mode>("RESPONSE");
  // 2. modal 닫기
  const onCloseModal = () => {
    // modal 애니메이션 끝나고 mode 변경
    setTimeout(() => {
      setMode("RESPONSE");
    }, 500);
  };
  // 3. modal 상태 초기화
  const initializeMode = useCallback(() => setMode("RESPONSE"), []);

  // 2. Request 비지니스 로직
  const { response, formValues, handleChange, handleSubmit, handleArray } =
    useHandleRequest({
      api,
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
  } = useHandleCode({ api, response, setMode });

  return (
    <div className={popupStyle.app}>
      <Header showBackButton />
      <div className={requestStyle.requestWrapper}>
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
                {mode === "LOADING" && <Loading />}
                {response && mode === "RESPONSE" && (
                  <ModalCodeBlock
                    description="Response"
                    code={JSON.stringify(response, null, 2)}
                    mode="RESPONSE"
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
    </div>
  );
};

export default Request;
