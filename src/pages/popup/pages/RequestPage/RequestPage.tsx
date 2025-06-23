import { APIWithParamsAndBodyAndHost } from "@/entities/docs/model/types/docs";
import { useHandleRequest } from "@/features/request-api/module/hooks/useHandleRequest";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import Loading from "@/shared/ui/Loading/Loading";
import Modal from "@/shared/ui/Modal";
import { vars } from "@/shared/ui/styles/theme.css";
import APIItem from "@/widgets/api-list/ui/api-item/ApiItem";
import useHandleCode from "@/widgets/code-block/module/hooks/useHandleCode";
import ModalCodeBlock from "@/widgets/code-block/ui/code-block-modal/CodeBlockView";
import { RequestBody } from "@/widgets/request-body/ui/api-body/RequestBody";
import { RequestParam } from "@/widgets/request-param/ui/api-param/RequestParam";
import { useCallback, useMemo, useReducer } from "react";
import { VscBracketError as ErrorIcon } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { apiListStyle } from "../ApiListPage/ui/apiList.css";
import { requestStyles } from "./request.css";

import {
  ApiMode,
  initialState,
  requestReducer,
  SchemaMode,
} from "@/features/request-api/module/requestReducer";
import { noop } from "@/shared/util/common";
import { openApiToLiteralJson } from "@/shared/util/typeGenerator";
import "react-toastify/dist/ReactToastify.css";

export type Mode =
  | "RESPONSE"
  | "TS"
  | "ERROR"
  | "AXIOS"
  | "FETCH"
  | "LOADING"
  | "ZOD";

type SchemaMode = "REQUEST_TYPE" | "RESPONSE_TYPE";

export const RequestPage = () => {
  // FIRST RENDER
  const api = useLocation().state as APIWithParamsAndBodyAndHost;

  const { params, body } = api;

  // INTERACTION
  // 1. mode 상태 관리
  const [state, dispatch] = useReducer(requestReducer, initialState);

  // 2. modal 닫기
  const onCloseModal = () => {
    // modal 애니메이션 끝나고 mode 변경
    setTimeout(() => {
      dispatch({ type: "INITIALIZE" });
    }, 500);
  };
  // 3. modal 상태 초기화
  const initializeMode = useCallback(
    () => dispatch({ type: "INITIALIZE_TYPE" }),
    []
  );

  const handleMode = (mode: "RESPONSE" | "ERROR" | "LOADING") => {
    if (state.type === "API_RESPONSE") {
      dispatch({ type: "SET_API_MODE", payload: mode as ApiMode });
      return;
    }

    dispatch({ type: "SET_SCHEMA_MODE", payload: mode as SchemaMode });
  };

  // 2. Request 비지니스 로직
  const { response, formValues, handleChange, handleSubmit, handleArray } =
    useHandleRequest({
      api,
      setMode: handleMode,
    });

  // 상태에 따라 code비즈니스 로직에 해당하는 코드 반환
  const baseCode = useMemo(() => {
    if (state.type === "API_RESPONSE") return response;

    if (state.schemaType === "REQUEST_TYPE") {
      const Json = openApiToLiteralJson(api.detailSchema?.requestType);
      return Json ?? "Request type is not defined for this API";
    }

    if (state.schemaType === "RESPONSE_TYPE") {
      const Json = openApiToLiteralJson(api.detailSchema?.responseType);
      return Json ?? "Response type is not defined for this API";
    }
  }, [state, api.detailSchema]);

  // 3. Code 비지니스 로직
  const {
    code,
    codeRef,
    copyToClipboard,
    onClickAxios,
    onClickFetch,
    onClickTS,
    onClickZod,
  } = useHandleCode({ api, response: baseCode, setMode: handleMode });

  return (
    <div className={apiListStyle.app}>
      <Header showBackButton />
      <div className={requestStyles.requestWrapper}>
        <form
          className={requestStyles.body}
          onSubmit={(e) => {
            dispatch({ type: "SET_API_MODE", payload: "RESPONSE" });
            handleSubmit(e);
          }}
        >
          <div className={requestStyles.apiItemContainer}>
            <APIItem api={api} />
          </div>
          <div className={requestStyles.requestBlock}>
            {!!params?.length && (
              <RequestParam
                params={params}
                formValues={formValues}
                handleChange={handleChange}
                handleArray={handleArray}
              />
            )}
            {!!body?.type.length && (
              <RequestBody
                body={body}
                formValues={formValues}
                handleChange={handleChange}
                handleArray={handleArray}
              />
            )}
            {!params?.length && !body?.type.length && (
              <div className={requestStyles.flexView}>
                <ErrorIcon size={26} color={vars.color.green} />
                <span className={requestStyles.description}>
                  No parameters or body
                </span>
              </div>
            )}
          </div>
          <div className={requestStyles.fixedButtonWrapper}>
            <Modal>
              <div className={requestStyles.modalTriggerContainer}>
                <div className={requestStyles.typeExtractionContainer}>
                  <div className={requestStyles.typeExtractionButtons}>
                    <Modal.Trigger
                      as={
                        <Button
                          type="button"
                          color="blue"
                          style={{ flex: 1 }}
                          onClick={() => {
                            dispatch({
                              type: "SET_SCHEMA_TYPE",
                              payload: "REQUEST_TYPE",
                            });
                          }}
                        >
                          Extract Request
                        </Button>
                      }
                    />
                    <Modal.Trigger
                      as={
                        <Button
                          type="button"
                          color="green"
                          style={{ flex: 1 }}
                          onClick={() => {
                            dispatch({
                              type: "SET_SCHEMA_TYPE",
                              payload: "RESPONSE_TYPE",
                            });
                          }}
                        >
                          Extract Response
                        </Button>
                      }
                    />
                  </div>
                </div>
                <Modal.Trigger
                  as={
                    <Button type="submit" onClick={noop}>
                      SUBMIT
                    </Button>
                  }
                />
              </div>
              <Modal.Content>
                {state.mode === "LOADING" && <Loading />}
                {state.type === "API_RESPONSE" && state.mode === "RESPONSE" && (
                  <ModalCodeBlock
                    description="Response"
                    code={JSON.stringify(response, null, 2)}
                    mode="base"
                    ref={codeRef}
                    onClose={onCloseModal}
                    onClickCopy={copyToClipboard}
                    onClickTS={onClickTS}
                    onClickAxios={onClickAxios}
                    onClickFetch={onClickFetch}
                    onClickZod={onClickZod}
                  />
                )}
                {state.type === "SCHEMA_DEFINITION" &&
                  state.mode === "BASE" && (
                    <ModalCodeBlock
                      description={state.schemaType}
                      code={JSON.stringify(baseCode, null, 2)}
                      mode="base"
                      ref={codeRef}
                      onClose={onCloseModal}
                      onClickCopy={copyToClipboard}
                      onClickTS={onClickTS}
                      onClickAxios={onClickAxios}
                      onClickFetch={onClickFetch}
                    />
                  )}
                {state.mode === "TS" && (
                  <ModalCodeBlock
                    description="Type"
                    code={code}
                    mode="TS"
                    ref={codeRef}
                    onClickBack={initializeMode}
                    onClickCopy={copyToClipboard}
                  />
                )}
                {state.mode === "ERROR" && (
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
                {state.mode === "AXIOS" && (
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
                {state.mode === "FETCH" && (
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
                {mode === "ZOD" && (
                  <ModalCodeBlock
                    description="ZOD"
                    descriptionColor="purple"
                    code={code}
                    mode="ZOD"
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
          autoClose={1500}
          theme="dark"
          transition={Flip}
        />
      </div>
    </div>
  );
};
