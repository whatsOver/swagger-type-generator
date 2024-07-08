import { API } from "@/pages/content/modules/getApiList";
import { useEffect, useState } from "react";
import {
  APIWithKey,
  updateAPI,
} from "../../../../entities/sequence/model/sequence-store";
import { ScenarioFunnelProps } from "../../pages/ScenarioFunnel/ScenarioFunnel";

type HandleSaveAPIProps = ScenarioFunnelProps;

const useHandleSaveAPI = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
}: HandleSaveAPIProps) => {
  const [tempApiList, setTempApiList] = useState<APIWithKey[]>([]);

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

  const onClickSave = () => {
    const convertTempApiListToApiList = tempApiList.map((tempAPI, idx) => ({
      order: idx,
      formValues: {},
      response: null,
      ...tempAPI,
    }));
    updateAPI(swaggerTitle, Number(sequenceId), convertTempApiListToApiList);
    onNext();
  };

  return { onClickAPI, onClickSave };
};

export default useHandleSaveAPI;
