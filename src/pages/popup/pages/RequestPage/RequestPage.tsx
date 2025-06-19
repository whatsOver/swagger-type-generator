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
import { useCallback, useState } from "react";
import { VscBracketError as ErrorIcon } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { apiListStyle } from "../ApiListPage/ui/apiList.css";
import { requestStyles } from "./request.css";

import { SchemaInfo } from "@/entities/swagger/types";
import { noop } from "@/shared/util/common";
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
  const typeInfo = (api as any).typeInfo || (api as any).detailSchema;

  // INTERACTION
  // 1. mode 상태 관리
  const [mode, setMode] = useState<Mode>("RESPONSE");
  const [schemaMode, setSchemaMode] = useState<SchemaMode | null>(null);
  // 2. modal 닫기
  const onCloseModal = () => {
    // modal 애니메이션 끝나고 mode 변경
    setTimeout(() => {
      setMode("RESPONSE");
      setSchemaMode(null);
    }, 500);
  };
  // 3. modal 상태 초기화
  const initializeMode = useCallback(() => setMode("RESPONSE"), []);

  const getJSONSchema = (typeSchema: SchemaInfo) => {
    if (!typeSchema) {
      return "No type available for this API";
    }

    const { properties, required } = typeSchema;
    const jsonData: Record<string, any> = {};

    Object.entries(properties).forEach(([key, value]) => {
      const isRequired = required.includes(key);
      const type = getTypeScriptType(value);
      jsonData[isRequired ? key : `${key}?`] = type;
    });

    return jsonData;
  };

  const getTypeScriptType = (property: unknown): string => {
    if (typeof property === "object" && property !== null) {
      const prop = property as any;
      if (prop.type === "string") {
        if (prop.format === "date-time") return "string";
        return "string";
      }
      if (prop.type === "integer" || prop.type === "number") return "number";
      if (prop.type === "boolean") return "boolean";
      if (prop.type === "array") {
        const itemType = getTypeScriptType(prop.items);
        return `${itemType}[]`;
      }
      if (prop.type === "object") return "object";
    }
    return "unknown";
  };

  // 2. Request 비지니스 로직
  const { response, formValues, handleChange, handleSubmit, handleArray } =
    useHandleRequest({
      api,
      setMode,
    });

  const currentCode = (() => {
    if (schemaMode === "REQUEST_TYPE") {
      return getJSONSchema(typeInfo?.requestType);
    }

    if (schemaMode === "RESPONSE_TYPE") {
      return getJSONSchema(typeInfo?.responseType);
    }
    return response;
  })();

  // 3. Code 비지니스 로직
  const {
    code,
    codeRef,
    copyToClipboard,
    onClickAxios,
    onClickFetch,
    onClickTS,
    onClickZod,
  } = useHandleCode({ api, response: currentCode, setMode });

  return (
    <div className={apiListStyle.app}>
      <Header showBackButton />
      <div className={requestStyles.requestWrapper}>
        <form className={requestStyles.body} onSubmit={handleSubmit}>
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
              <Modal.Trigger
                as={
                  <div
                    onClick={noop}
                    className={requestStyles.modalTriggerContainer}
                  >
                    <div className={requestStyles.typeExtractionContainer}>
                      <div className={requestStyles.typeExtractionButtons}>
                        <Button
                          type="button"
                          color="blue"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setSchemaMode("REQUEST_TYPE");
                          }}
                        >
                          Extract Request
                        </Button>

                        <Button
                          type="button"
                          color="green"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setSchemaMode("RESPONSE_TYPE");
                          }}
                        >
                          Extract Response
                        </Button>
                      </div>
                    </div>
                    <Button onClick={() => setSchemaMode(null)} type="submit">
                      SUBMIT
                    </Button>
                  </div>
                }
              />
              <Modal.Content>
                {mode === "LOADING" && <Loading />}
                {schemaMode === null && response && mode === "RESPONSE" && (
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
                    onClickZod={onClickZod}
                  />
                )}
                {schemaMode !== null && mode === "RESPONSE" && (
                  <ModalCodeBlock
                    description={schemaMode}
                    code={JSON.stringify(currentCode, null, 2)}
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
