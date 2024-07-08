import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

import { useSettingStore } from "@/entities/setting/model/setting-store";
import {
  generateAxiosAPICode,
  generateFetchAPICode,
  generateInterface,
} from "@/features/api-generate/module/utils/apiGenerator";
import { generateReactQueryHook } from "@/features/react-query-generate/module/queryGenerator";
import { APIWithParamsAndBodyAndHost } from "@/pages/content/modules/getApiList";
import { useCopy } from "@/shared/hooks/useCopy";
import { jsonToTs } from "@/shared/util/typeGenerator";

interface HandleCode {
  api: APIWithParamsAndBodyAndHost | null;
  response: unknown;
  setMode: Dispatch<SetStateAction<string>>;
}

export interface HandleCodeReturn {
  code: string;
  codeRef: MutableRefObject<null | HTMLDivElement>;
  onClickTS: () => void;
  onClickAxios: () => void;
  onClickFetch: () => void;
  copyToClipboard: () => void;
}

const useHandleCode = ({
  api,
  response,
  setMode,
}: HandleCode): HandleCodeReturn => {
  // FIRST RENDER

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
        (generateInterface(api.params, api.body, api.method) +
          "\n" +
          generateAxiosAPICode({
            api: {
              method: api.method,
              path: api.path,
              host: api.host,
              params: api.params,
              body: api.body,
              contentType: api.contentType,
            },
            rootInterfaceKey,
          })) +
        "\n\n" +
        (withReactQuery
          ? generateReactQueryHook({
              api: { method: api.method, params: api.params },
              apiFunctionName: `${api.method.toLowerCase()}API`,
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
        (generateInterface(api.params, api.body, api.method) +
          "\n" +
          generateFetchAPICode({
            api: {
              method: api.method,
              path: api.path,
              host: api.host,
              params: api.params,
              body: api.body,
              contentType: api.contentType,
            },
            rootInterfaceKey,
          })) +
        "\n\n" +
        (withReactQuery
          ? generateReactQueryHook({
              api: { method: api.method, params: api.params },
              apiFunctionName: `${api.method.toLowerCase()}API`,
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
