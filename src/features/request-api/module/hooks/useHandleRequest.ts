import { EMPTY_RESPONSE } from "@/entities/api/config/status";
import { useAuthStore } from "@/entities/auth/model/auth-store";
import { Schemas } from "@/entities/swagger/types";
import { APIWithParamsAndBodyAndHost } from "@/pages/content/modules/getApiList";
import { Mode } from "@/pages/popup/pages/Request/Request";
import axios, { RawAxiosRequestHeaders } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { generateFormData, getBody, getQueryParams } from "../utils/request";
import useForm, { FormValues, ReturnUseForm } from "./useForm";

interface HandleRequest {
  api: APIWithParamsAndBodyAndHost | null;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  initialFormValues?: FormValues;
  onSuccess?: (response: unknown) => void;
}

export type ReturnUseHandleRequest = {
  response: unknown;
  formValues: FormValues;
  handleArray: ReturnUseForm["handleArray"];
  handleChange: (e: FormEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  resetFormValues: ReturnUseForm["resetFormValues"];
  settingFormValues: ReturnUseForm["settingFormValues"];
};

export type OmitHandleFormValues = Omit<
  ReturnUseHandleRequest,
  "resetFormValues" | "settingFormValues"
>;

export const useHandleRequest = ({
  api,
  setMode,
  initialFormValues,
  onSuccess,
}: HandleRequest): ReturnUseHandleRequest => {
  // FIRST RENDER

  const token = useAuthStore((state) => state.token);

  // INTERACTION
  // 1. 유저 > params, body 입력
  const {
    formValues,
    handleArray,
    handleChange,
    setFormValues,
    resetFormValues,
    settingFormValues,
  } = useForm(initialFormValues);

  // 1-1. 유저 > params, body 입력 > 초기값 설정
  useEffect(() => {
    if (!api) return;
    if (!initialFormValues) return;
    if (Object.keys(initialFormValues).length) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialValues: Record<string, any> = {};
    api.params?.forEach((param) => {
      if (param.example && param.required) {
        initialValues[param.name] = param.example;
      }
      if (param.schema?.default) {
        initialValues[param.name] = param.schema.default;
      }
    });

    api.body?.properties &&
      Object.keys(api.body.properties).forEach((key) => {
        if (api.body.properties[key].example) {
          initialValues[key] = api.body.properties[key].example;
        }
        if (api.body.properties[key].default) {
          initialValues[key] = api.body.properties[key].default;
        }
      });
    setFormValues(initialValues);
  }, [api, initialFormValues, setFormValues]);

  // 2. 유저 > 요청 버튼 클릭
  const [response, setResponse] = useState(null);

  // 2-1. 유저 > 요청 버튼 클릭 > 요청 보내기
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMode("LOADING");

    const transformPath = api.params
      ? api.params.reduce((acc, param) => {
          return param.in === "path"
            ? acc.replace(`{${param.name}}`, formValues[param.name] as string)
            : acc;
        }, api.path)
      : api.path;

    const getBodyData = (body: Schemas) => {
      if (!body) return {};
      if (api.contentType === "multipart/form-data") {
        return generateFormData(body, formValues);
      }
      return getBody(body, formValues);
    };

    try {
      const headers: RawAxiosRequestHeaders = token.length
        ? { Authorization: `Bearer ${token}`, "Content-Type": api.contentType }
        : { "Content-Type": api.contentType };
      const response = await axios({
        method: api.method,
        url: api.host + transformPath,
        params: api.params ? getQueryParams(api.params, formValues) : {},
        data: getBodyData(api.body),
        headers,
        paramsSerializer: (params) => {
          return Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        },
      });
      onSuccess && onSuccess(response.data);
      // 응답이 없는 경우 Default Response를 보여준다.
      if (!response.data) {
        toast.success(`${response.status} ${response.statusText}`);
        setResponse(EMPTY_RESPONSE);
        setMode("RESPONSE");
        return;
      }

      toast.success(`${response.status} ${response.statusText}`);
      setResponse(response.data);
      setMode("RESPONSE");
    } catch (error) {
      setMode("ERROR");
      toast.error(`${error.response?.status} ${error.response?.statusText}`);
      setResponse(error.response?.data);
    }
  };

  return {
    response,
    formValues,
    handleArray,
    handleChange,
    handleSubmit,
    resetFormValues,
    settingFormValues,
  };
};
