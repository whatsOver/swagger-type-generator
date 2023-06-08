import { API, APIList, Path } from "@src/pages/content/modules/getAPIList";
import { useState } from "react";
import useGetAPIList from "../useGetAPIList";
import { useGETDocs } from "../../api/docs";
import { convertSelectedAPI } from "../../util/convertSelectedAPI";
import useRouter from "../useRouter";

const useHandlePopup = () => {
  const { push } = useRouter();

  // FIRST RENDER
  const [apiList, setAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
  });

  const [pathInfo, setPathInfo] = useState<Path>({
    host: "",
    href: "",
  });

  const [filteredAPIList, setFilteredAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
  });

  // SERVER
  // 1. API 리스트를 가져온다 > 사용자 웹 브라우저로부터
  useGetAPIList({ setAPIList, setPathInfo });

  // 2. 상세 API 리스트를 가져온다 > swagger 문서로부터
  const { data: apiDocsData } = useGETDocs(pathInfo);

  // INTERACTION
  // 1. 사용자 > API 클릭 > API 상세 페이지로 이동
  const onClickAPI = (api: API) => {
    push("/request", {
      ...convertSelectedAPI(apiDocsData, api),
      host: pathInfo.host,
    });
  };

  return {
    apiList,
    filteredAPIList,
    apiDocsData,
    pathInfo,
    onClickAPI,
    setFilteredAPIList,
  };
};

export default useHandlePopup;
