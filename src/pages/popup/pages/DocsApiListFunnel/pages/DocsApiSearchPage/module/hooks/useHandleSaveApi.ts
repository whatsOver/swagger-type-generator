import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { API, PathInfo } from "@/entities/docs/model/types/docs";
import { APIWithKey } from "@/entities/sequence/types/sequence";
import { useGETDocs } from "@/entities/swagger/api/get-document";
import { useSwaggerDocStore } from "@/entities/swagger/model/store/swaggerDocsStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface HandleSaveApiProps {
  apis: APIWithKey[];
  onNext: () => void;
}

interface ApiAddFunnelParams extends Record<string, string> {
  id: string;
}

export const useHandleSaveApi = ({ apis, onNext }: HandleSaveApiProps) => {
  const { id: docId } = useParams<ApiAddFunnelParams>();

  const { pathInfo } = useSwaggerDocStore();

  const { data: apiDocsData } = useGETDocs(pathInfo);
  const [tempApiList, setTempApiList] = useState<APIWithKey[]>([]);

  const { addPathsToDoc } = useDocsStore();

  useEffect(() => {
    setTempApiList(
      apis.map((api, idx) => ({
        key: `${api.api.method}${api.api.path}${idx}`,
        ...api,
      }))
    );
  }, [apis]);

  const onClickAPI = (key: string, api: API) => {
    if (tempApiList.find((tempAPI) => tempAPI.key === key)) {
      setTempApiList(tempApiList.filter((tempAPI) => tempAPI.key !== key));
    } else {
      setTempApiList([...tempApiList, { key, api, iconType: "LOADING" }]);
    }
  };

  const onClickSave = async () => {
    const convertTempApiListToApiList: PathInfo[] = tempApiList.map(
      (tempAPI) => {
        const findApi =
          apiDocsData?.paths[tempAPI.api.path][tempAPI.api.method];

        return {
          path: pathInfo.host + tempAPI.api.path,
          method: tempAPI.api.method,
          information: findApi,
        };
      }
    );

    await addPathsToDoc(docId, convertTempApiListToApiList);

    onNext();
  };

  return { onClickAPI, onClickSave };
};
