import { API } from "@/pages/content/modules/getApiList2";

import { useSwaggerDocStore } from "@/entities/document/model/document-store";
import useRouter from "../../../../../shared/hooks/useRouter";
import useGetApiList from "../../../../../widgets/api-list/module/hooks/useGetApiList";
import { useGETDocs } from "../../../shared/api/docs";
import { convertSelectedAPI } from "../../../shared/util/convertSelectedAPI";

const useHandlePopup = () => {
  const { push } = useRouter();

  // FIRST RENDER
  const {
    ApiList,
    filteredApiList,
    pathInfo,
    setApiList,
    setFilteredApiList,
    setPathInfo,
  } = useSwaggerDocStore();

  // SERVER
  // 1. API 리스트를 가져온다 > 사용자 웹 브라우저로부터
  const { loading } = useGetApiList({ setApiList, setPathInfo });

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
    loading,
    ApiList,
    filteredApiList,
    apiDocsData,
    pathInfo,
    onClickAPI,
    setFilteredApiList,
  };
};

export default useHandlePopup;
