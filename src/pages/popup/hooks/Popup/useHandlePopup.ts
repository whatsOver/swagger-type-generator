import { API } from "@src/pages/content/modules/getAPIList";
import useGetAPIList from "../useGetAPIList";
import { useGETDocs } from "../../api/docs";
import { convertSelectedAPI } from "../../util/convertSelectedAPI";
import useRouter from "../useRouter";
import useSwaggerDocStore from "../../store/swaggerDoc";

const useHandlePopup = () => {
  const { push } = useRouter();

  // FIRST RENDER
  const {
    apiList,
    filteredAPIList,
    pathInfo,
    setAPIList,
    setFilteredAPIList,
    setPathInfo,
  } = useSwaggerDocStore();

  // SERVER
  // 1. API 리스트를 가져온다 > 사용자 웹 브라우저로부터
  const { loading } = useGetAPIList({ setAPIList, setPathInfo });

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
    apiList,
    filteredAPIList,
    apiDocsData,
    pathInfo,
    onClickAPI,
    setFilteredAPIList,
  };
};

export default useHandlePopup;
