import { API } from "@/entities/docs/model/types/docs";
import { useSequenceStore } from "@/entities/sequence/hooks/useSequenceStore";
import { APIWithKey, APIWithOrder } from "@/entities/sequence/types/sequence";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import { useEffect, useState } from "react";

type HandleSaveAPIProps = ScenarioFunnelProps;

export const useHandleSaveAPI = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
}: HandleSaveAPIProps) => {
  const [tempApiList, setTempApiList] = useState<APIWithKey[]>([]);

  const { updateAPI } = useSequenceStore();

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
    const convertTempApiListToApiList: APIWithOrder[] = tempApiList.map(
      (tempAPI, idx) => ({
        order: idx,
        formValues: {},
        response: null,
        request: null,
        ...tempAPI,
      })
    );

    await updateAPI(
      swaggerTitle,
      Number(sequenceId),
      convertTempApiListToApiList
    );
    onNext(convertTempApiListToApiList);
  };

  return { onClickAPI, onClickSave };
};
