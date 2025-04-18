import { APIWithParamsAndBodyAndHost } from "@/entities/docs/model/types/docs";
import { useSequenceStore } from "@/entities/sequence/hooks/useSequenceStore";
import {
  APIWithOrder,
  SequenceItemType,
} from "@/entities/sequence/types/sequence";
import { useSwaggerDocStore } from "@/entities/swagger/model/store/swaggerDocsStore";
import { transformApiFromSwagger } from "@/features/api-generate/module/utils/apiTransform";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import { useHandleRequest } from "@/features/request-api/module/hooks/useHandleRequest";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import Button from "@/shared/ui/Button";
import BottomFixedButton from "@/shared/ui/Button/BottomFixedButton";
import Header from "@/shared/ui/Header";
import FullPageLoading from "@/shared/ui/Loading/FullPageLoading";
import { useHandleApiList } from "@/widgets/api-list/module/hooks/useHandleApiList";
import useHandleCode from "@/widgets/code-block/module/hooks/useHandleCode";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
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

const SEQUENCE_ITEM: SequenceItemType = {
  id: 0,
  title: "",
  apiList: [],
  iconType: "SUCCESS",
};

const MultipleTestPage = () => {
  // FIRST RENDER
  const { id: sequenceId, apiId } = useParams<{ id: string; apiId: string }>();
  const { swaggerTitle } = useLocation().state as { swaggerTitle: string };

  // Swagger 문서 정보 가져오기
  const { updateFormValues, updateResponse } = useSequenceStore();
  const { apiDocsData: apiDocs } = useHandleApiList();

  const { pathInfo } = useSwaggerDocStore();

  const [mode, setMode] = useState<Mode>("REQUEST");

  const initializeMode = () => setMode("RESPONSE");
  const setRequestMode = () => setMode("REQUEST");

  // 1. chrome storage에서 sequence 정보 가져오기
  const { sequences } = useSequenceStore();

  const currentSequence = useMemo(() => {
    return sequences[swaggerTitle]
      ? sequences[swaggerTitle].find(
          (sequence) => sequence.id === Number(sequenceId)
        ) ?? SEQUENCE_ITEM
      : SEQUENCE_ITEM;
  }, [sequences, swaggerTitle, sequenceId]);

  // 2. 선택된 API 관리
  const [currentAPIKey, setCurrentAPIKey] = useState<string>("");
  const [apiKeys, setAPIKeys] = useState<string[]>([]);

  // 2-1. 첫 렌더링 시 첫 번째 API 선택
  useEffect(() => {
    if (!currentSequence.apiList.length) return;
    if (currentAPIKey !== "") return;
    setCurrentAPIKey(currentSequence.apiList[apiId].key);
    setAPIKeys(currentSequence.apiList.map((item) => item.key));
  }, [currentSequence.apiList, currentAPIKey, apiId]);

  // 3. 선택된 API 정보 가져오기
  const [currentSwaggerAPI, setCurrentSwaggerAPI] =
    useState<APIWithParamsAndBodyAndHost | null>(null);

  const [currentAPI, setCurrentAPI] = useState<APIWithOrder | null>(null);

  useEffect(() => {
    if (!currentSequence.apiList.length) return;
    if (!currentAPIKey.length) return;
    const findAPI = currentSequence.apiList.find(
      (item) => item.key === currentAPIKey
    );

    if (findAPI) {
      setCurrentAPI(findAPI);
      setCurrentSwaggerAPI({
        ...transformApiFromSwagger(apiDocs, findAPI.api),
        host: pathInfo.host,
      });
    }
  }, [currentSequence.apiList, apiDocs, currentAPIKey]);

  const onSuccessRequest = (request: unknown, response: unknown) => {
    updateFormValues(
      swaggerTitle,
      Number(sequenceId),
      currentAPIKey,
      formValues
    );
    updateResponse({
      swaggerTitle,
      sequenceId: Number(sequenceId),
      key: currentAPIKey,
      response,
      request,
    });
    setCurrentAPI({
      ...currentAPI,
      response,
      iconType: "SUCCESS",
      request: formValues,
    });
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
    initialFormValues: currentAPI ? (currentAPI.request as FormValues) : {},
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
    <div className={apiListStyle.app}>
      <Header
        showBackButton
        headerTitle={currentSequence.title}
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
          apiList={currentSequence.apiList}
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
        autoClose={1500}
        theme="dark"
        transition={Flip}
      />
    </div>
  );
};

export default MultipleTestPage;
