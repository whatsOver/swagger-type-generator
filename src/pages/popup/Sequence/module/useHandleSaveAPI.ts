import { API } from "@src/pages/content/modules/getAPIList";
import { useEffect, useState } from "react";
import { ScenarioFunnelProps } from "../../pages/ScenarioFunnel/ScenarioFunnel";
import { APIWithKey, updateAPI } from "../store/sequence";

type HandleSaveAPIProps = ScenarioFunnelProps;

const useHandleSaveAPI = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
}: HandleSaveAPIProps) => {
  const [tempAPIList, setTempAPIList] = useState<APIWithKey[]>([]);

  useEffect(() => {
    setTempAPIList(
      apis.map((api, idx) => ({
        key: `${api.api.method}${api.api.path}${idx}`,
        ...api,
      }))
    );
  }, [apis]);

  const onClickAPI = (key: string, api: API) => {
    if (tempAPIList.find((tempAPI) => tempAPI.key === key)) {
      setTempAPIList(tempAPIList.filter((tempAPI) => tempAPI.key !== key));
    } else {
      setTempAPIList([...tempAPIList, { key, api, iconType: "LOADING" }]);
    }
  };

  const onClickSave = () => {
    const convertTempAPIListToAPIList = tempAPIList.map((tempAPI, idx) => ({
      order: idx,
      formValues: {},
      response: null,
      ...tempAPI,
    }));
    updateAPI(swaggerTitle, Number(sequenceId), convertTempAPIListToAPIList);
    onNext();
  };

  return { onClickAPI, onClickSave };
};

export default useHandleSaveAPI;
