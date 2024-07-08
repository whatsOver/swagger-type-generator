import { useSwaggerDocStore } from "@/entities/document/model/document-store";
import { APIWithParamsAndBodyAndHost } from "@/pages/content/modules/getApiList2";
import useHandleCode from "@/pages/popup/hooks/Request/useHandleCode";
import useHandlePopup from "@/pages/popup/pages/Popup/hooks/useHandlePopup";
import { popupStyle } from "@/pages/popup/pages/Popup/ui/popup.css";
import { convertSelectedAPI } from "@/pages/popup/shared/util/convertSelectedAPI";
import Button from "@/shared/ui/Button";
import BottomFixedButton from "@/shared/ui/Button/BottomFixedButton";
import Header from "@/shared/ui/Header";
import FullPageLoading from "@/shared/ui/Loading/FullPageLoading";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import {
  APIWithOrder,
  sequenceStorage,
  updateFormValues,
  updateResponse,
} from "../../../../../entities/sequence/model/sequence-store";
import useHandleRequest from "../../../../../features/request-api/module/hooks/useHandleRequest";
import CompoundMultipleTest from "./CompoundMultipleTest";
import { multipleStyles } from "./multiple.css";

export type Mode =
  | "REQUEST"
  | "RESPONSE"
  | "TS"
  | "ERROR"
  | "AXIOS"
  | "FETCH"
  | "LOADING";

const MultipleTestPage = () => {
  // FIRST RENDER
  const { id: sequenceId, apiId } = useParams<{ id: string; apiId: string }>();
  const { swaggerTitle } = useLocation().state as { swaggerTitle: string };

  // Swagger 문서 정보 가져오기
  const { apiDocsData: apiDocs } = useHandlePopup();

  const { pathInfo } = useSwaggerDocStore();

  const [mode, setMode] = useState<Mode>("REQUEST");

  const initializeMode = () => setMode("RESPONSE");
  const setRequestMode = () => setMode("REQUEST");

  // 1. chrome storage에서 sequence 정보 가져오기
  const [apis, setAPIs] = useState<APIWithOrder[]>([]);
  const [sequenceTitle, setSequenceTitle] = useState<string>("");

  useEffect(() => {
    if (!swaggerTitle) return;
    sequenceStorage.subscribe((sequence) => {
      const findSequence = sequence[swaggerTitle].find(
        (item) => item.id === Number(sequenceId)
      );

      if (findSequence) {
        setSequenceTitle(findSequence.title);
        setAPIs(findSequence.ApiList);
      }
    });
  }, [swaggerTitle]);

  // 2. 선택된 API 관리
  const [currentAPIKey, setCurrentAPIKey] = useState<string>("");
  const [apiKeys, setAPIKeys] = useState<string[]>([]);

  // 2-1. 첫 렌더링 시 첫 번째 API 선택
  useEffect(() => {
    if (!apis.length) return;
    if (currentAPIKey !== "") return;
    setCurrentAPIKey(apis[apiId].key);
    setAPIKeys(apis.map((item) => item.key));
  }, [apis, currentAPIKey, apiId]);

  // 3. 선택된 API 정보 가져오기
  const [currentSwaggerAPI, setCurrentSwaggerAPI] =
    useState<APIWithParamsAndBodyAndHost | null>(null);

  const [currentAPI, setCurrentAPI] = useState<APIWithOrder | null>(null);

  useEffect(() => {
    if (!apis.length) return;
    if (!currentAPIKey.length) return;
    const findAPI = apis.find((item) => item.key === currentAPIKey);

    if (findAPI) {
      setCurrentAPI(findAPI);
      setCurrentSwaggerAPI({
        ...convertSelectedAPI(apiDocs, findAPI.api),
        host: pathInfo.host,
      });
    }
  }, [apis, apiDocs, currentAPIKey]);

  const onSuccessRequest = (response: unknown) => {
    updateFormValues(
      swaggerTitle,
      Number(sequenceId),
      currentAPIKey,
      formValues
    );
    updateResponse(swaggerTitle, Number(sequenceId), currentAPIKey, response);
  };

  const {
    response,
    formValues,
    handleArray,
    handleChange,
    handleSubmit,
    resetFormValues,
    settingFormValues,
  } = useHandleRequest({
    api: currentSwaggerAPI,
    setMode,
    onSuccess: onSuccessRequest,
    initialFormValues: currentAPI ? currentAPI.formValues : {},
  });

  const codeAction = useHandleCode({
    api: currentSwaggerAPI,
    response,
    setMode,
  });

  const onClickNext = () => {
    // 다음 API가 있으면 다음 API로 이동
    // 만약 마지막 API라면 첫 번째 API로 이동
    const currentIndex = apiKeys.indexOf(currentAPIKey);
    const nextIndex = currentIndex + 1;
    if (nextIndex < apiKeys.length) {
      setCurrentAPIKey(apiKeys[nextIndex]);
    } else {
      setCurrentAPIKey(apiKeys[0]);
    }
    resetFormValues();
    settingFormValues(currentAPI.formValues);
    setMode("REQUEST");
  };

  const onChangeAPI = (key: string) => {
    setCurrentAPIKey(key);
    resetFormValues();
    settingFormValues(currentAPI.formValues);
    setMode("REQUEST");
  };

  return (
    <div className={popupStyle.app}>
      <Header
        showBackButton
        headerTitle={sequenceTitle}
        rightButton={
          <div className={multipleStyles.headerRightButtonWrapper}>
            <Button onClick={() => setMode("REQUEST")}>Request</Button>
            <Button
              disabled={!currentAPI?.response}
              onClick={() => setMode("RESPONSE")}
            >
              Response
            </Button>
            <Button onClick={onClickNext}>Next</Button>
          </div>
        }
      />
      <CompoundMultipleTest>
        <CompoundMultipleTest.SequenceApiList
          ApiList={apis}
          currentAPIKey={currentAPIKey}
          onChangeAPI={onChangeAPI}
        />
        {!!currentSwaggerAPI && (mode === "REQUEST" || mode === "LOADING") && (
          <CompoundMultipleTest.Request
            api={currentSwaggerAPI}
            formValues={formValues}
            handleArray={handleArray}
            response={response}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
          >
            <BottomFixedButton>
              <BottomFixedButton.First type="submit">
                SUBMIT
              </BottomFixedButton.First>
            </BottomFixedButton>
          </CompoundMultipleTest.Request>
        )}
        {mode === "LOADING" && (
          <FullPageLoading onClick={() => setMode("REQUEST")} />
        )}
        {mode !== "REQUEST" && mode !== "LOADING" && (
          <CompoundMultipleTest.CodeBlock
            mode={mode}
            response={currentAPI.response}
            initializeMode={initializeMode}
            setRequestMode={setRequestMode}
            {...codeAction}
          />
        )}
      </CompoundMultipleTest>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        theme="dark"
        transition={Flip}
      />
    </div>
  );
};

export default MultipleTestPage;
