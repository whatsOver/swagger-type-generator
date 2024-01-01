import { useEffect, FormEvent, useState } from "react";
import useAuthStore from "../../store/auth";
import type { Mode, RequestProps } from "../../pages/Request/Request";
import useForm from "../useForm";
import { useLocation } from "react-router-dom";
import axios, { RawAxiosRequestHeaders } from "axios";
import { generateFormData, getBody, getQueryParams } from "../../util/request";
import { toast } from "react-toastify";
import { EMPTY_RESPONSE } from "../../constants/status";
import { Schemas } from "../../api/docs";

interface HandleRequest {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const useHandleRequest = ({ setMode }: HandleRequest) => {
  // FIRST RENDER
  const { method, params, path, body, host, contentType } = useLocation()
    .state as RequestProps;

  const token = useAuthStore((state) => state.token);

  // INTERACTION
  // 1. 유저 > params, body 입력
  const { formValues, handleChange, setFormValues, handleArray } = useForm();

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
    e.preventDefault();
    setMode("LOADING");

    const transformPath = params
      ? params.reduce((acc, param) => {
          return param.in === "path"
            ? acc.replace(`{${param.name}}`, formValues[param.name] as string)
            : acc;
        }, path)
      : path;

    const getBodyData = (body: Schemas) => {
      if (!body) return {};
      if (contentType === "multipart/form-data") {
        return generateFormData(body, formValues);
      }
      return getBody(body, formValues);
    };

    try {
      const headers: RawAxiosRequestHeaders = token.length
        ? { Authorization: `Bearer ${token}`, "Content-Type": contentType }
        : { "Content-Type": contentType };
      const response = await axios({
        method,
        url: host + transformPath,
        params: params ? getQueryParams(params, formValues) : {},
        data: getBodyData(body),
        headers,
        paramsSerializer: (params) => {
          return Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        },
      });
      // 응답이 없는 경우 Default Response를 보여준다.
      if (!response.data) {
        toast.success(`${response.status} ${response.statusText}`);
        setResponse(EMPTY_RESPONSE);
        setMode("REQUEST");
        return;
      }

      toast.success(`${response.status} ${response.statusText}`);
      setResponse(response.data);
      setMode("REQUEST");
    } catch (error) {
      setMode("ERROR");
      toast.error(`${error.response?.status} ${error.response?.statusText}`);
      setResponse(error.response?.data);
    }
  };

  return {
    response,
    formValues,
    handleChange,
    handleSubmit,
    handleArray,
  };
};

export default useHandleRequest;
