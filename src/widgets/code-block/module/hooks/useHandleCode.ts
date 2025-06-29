import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

import { APIWithParamsAndBodyAndHost } from "@/entities/docs/model/types/docs";
import { useSettingStore } from "@/entities/setting/model/setting-store";
import { SchemaInfo } from "@/entities/swagger/types";
import {
  generateAxiosAPICode,
  generateFetchAPICode,
  generateInterface,
} from "@/features/api-generate/module/utils/apiGenerator";
import { generateReactQueryHook } from "@/features/react-query-generate/module/queryGenerator";
import { useCopy } from "@/shared/hooks/useCopy";
import { jsonToTs, jsonToZod } from "@/shared/util/typeGenerator/json";
import { openApiToTs, openApiToZod } from "@/shared/util/typeGenerator/openApi";

export type SourceData =
  | {
      data: unknown;
      type: "JSON";
    }
  | {
      type: "OPEN_API";
      data: SchemaInfo | null;
    };

interface HandleCode {
  api: APIWithParamsAndBodyAndHost | null;
  sourceData: SourceData;
  setMode: Dispatch<SetStateAction<string>>;
}

export interface HandleCodeReturn {
  code: string;
  codeRef: MutableRefObject<null | HTMLDivElement>;
  onClickTS: () => void;
  onClickAxios: () => void;
  onClickFetch: () => void;
  onClickZod: () => void;
  copyToClipboard: () => void;
}

const useHandleCode = ({
  api,
  sourceData,
  setMode,
}: HandleCode): HandleCodeReturn => {
  // FIRST RENDER

  // INTERACTION
  // 1. 사용자에게 보여줄 코드
  const [code, setCode] = useState<string>("");

  // 2. 유저 > TS 버튼 클릭
  const onClickTS = () => {
    setMode("TS");
    if (sourceData.type === "JSON") {
      setCode(jsonToTs("json", sourceData.data).interfaceArray.join("\n"));
      return;
    }

    if (sourceData.data) {
      setCode(openApiToTs(sourceData.data, "Schema").interfaceArray.join("\n"));
      return;
    }
  };

  // 3. 유저 > Axios 버튼 클릭
  const { withReactQuery } = useSettingStore();

  const onClickAxios = () => {
    setMode("AXIOS");
    let interfaceArray: string[];
    let rootInterfaceKey: string;

    if (sourceData.type === "JSON") {
      const result = jsonToTs("json", sourceData.data);
      interfaceArray = result.interfaceArray;
      rootInterfaceKey = result.rootInterfaceKey;
    } else {
      const result = openApiToTs(sourceData.data, "Schema");
      interfaceArray = result.interfaceArray;
      rootInterfaceKey = result.rootInterfaceKey;
    }

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
    let interfaceArray: string[];
    let rootInterfaceKey: string;

    if (sourceData.type === "JSON") {
      const result = jsonToTs("json", sourceData.data);
      interfaceArray = result.interfaceArray;
      rootInterfaceKey = result.rootInterfaceKey;
    } else {
      const result = openApiToTs(sourceData.data, "Schema");
      interfaceArray = result.interfaceArray;
      rootInterfaceKey = result.rootInterfaceKey;
    }
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

  // 5. 유저 > Zod 버튼 클릭
  const onClickZod = () => {
    setMode("ZOD");
    if (sourceData.type === "JSON") {
      const zodSchema = jsonToZod(sourceData.data, "Response");
      setCode(zodSchema);
      return;
    }

    if (sourceData.data) {
      const zodSchema = openApiToZod(sourceData.data, "Response");
      setCode(zodSchema);
      return;
    }
  };

  // 6. 유저 > 복사 버튼 클릭
  const codeRef = useRef(null);
  const { copyToClipboard } = useCopy({ codeRef });

  return {
    code,
    codeRef,
    onClickTS,
    onClickAxios,
    onClickFetch,
    onClickZod,
    copyToClipboard,
  };
};

export default useHandleCode;
