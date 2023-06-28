import { useEffect, FormEvent, useState } from "react";
import useAuthStore from "../../store/auth";
import type { Mode, RequestProps } from "../../ui/Request";
import useForm from "../useForm";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getBody, getQueryParams } from "../../util/request";
import { toast } from "react-toastify";
import { EMPTY_RESPONSE } from "../../constants/status";

interface HandleRequest {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const useHandleRequest = ({ setMode }: HandleRequest) => {
  // FIRST RENDER
  const { method, params, path, body, host } = useLocation()
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
        setMode("REQUEST");
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

  return {
    response,
    handleChange,
    handleSubmit,
  };
};

export default useHandleRequest;
