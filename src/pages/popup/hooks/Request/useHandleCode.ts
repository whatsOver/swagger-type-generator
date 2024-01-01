import { useState, useRef, Dispatch, SetStateAction } from "react";
import useCopy from "../useCopy";
import { jsonToTs } from "@src/common/util/typeGenerator";
import {
  generateAxiosAPICode,
  generateFetchAPICode,
  generateInterface,
} from "../../util/apiGenerator";
import { useLocation } from "react-router-dom";
import { RequestProps } from "../../pages/Request/Request";
import useSettingStore from "../../store/setting";
import { generateReactQueryHook } from "../../util/queryGenerator";

interface HandleCode {
  response: unknown;
  setMode: Dispatch<SetStateAction<string>>;
}

const useHandleCode = ({ response, setMode }: HandleCode) => {
  // FIRST RENDER
  // 1. location state에서 method, params, path, body, host 가져오기
  const { method, params, path, body, host, contentType } = useLocation()
    .state as RequestProps;

  // INTERACTION
  // 1. 사용자에게 보여줄 코드
  const [code, setCode] = useState<string>("");

  // 2. 유저 > TS 버튼 클릭
  const onClickTS = () => {
    setMode("TS");
    setCode(jsonToTs("json", response).interfaceArray.join("\n"));
  };

  // 3. 유저 > Axios 버튼 클릭
  const { withReactQuery } = useSettingStore();

  const onClickAxios = () => {
    setMode("AXIOS");
    const { interfaceArray, rootInterfaceKey } = jsonToTs("json", response);
    setCode(interfaceArray.join("\n"));
    setCode(
      (prev) =>
        prev +
        "\n\n" +
        (generateInterface(params, body, method) +
          "\n" +
          generateAxiosAPICode({
            api: { method, path, host, params, body, contentType },
            rootInterfaceKey,
          })) +
        "\n\n" +
        (withReactQuery
          ? generateReactQueryHook({
              api: { method, params },
              apiFunctionName: `${method.toLowerCase()}API`,
            })
          : "")
    );
  };

  // 4. 유저 > Fetch 버튼 클릭
  const onClickFetch = () => {
    setMode("FETCH");
    const { interfaceArray, rootInterfaceKey } = jsonToTs("json", response);
    setCode(interfaceArray.join("\n"));
    setCode(
      (prev) =>
        prev +
        "\n\n" +
        (generateInterface(params, body, method) +
          "\n" +
          generateFetchAPICode({
            api: { method, path, host, params, body, contentType },
            rootInterfaceKey,
          })) +
        "\n\n" +
        (withReactQuery
          ? generateReactQueryHook({
              api: { method, params },
              apiFunctionName: `${method.toLowerCase()}API`,
            })
          : "")
    );
  };

  // 5. 유저 > 복사 버튼 클릭
  const codeRef = useRef(null);
  const { copyToClipboard } = useCopy({ codeRef });

  return {
    code,
    codeRef,
    onClickTS,
    onClickAxios,
    onClickFetch,
    copyToClipboard,
  };
};

export default useHandleCode;
