import { useState } from "react";
import { popupStyle } from "./styles/popup.css";
import Search from "./ui/Search";
import APIItem from "./ui/APIItem";
import useGetAPIList, { APIList } from "./hooks/useGetAPIList";
import useSearch from "./hooks/useSearch";
import { useGETDocs } from "./api/docs";
import { RequestProps } from "./ui/Request";
import { vars } from "@src/common/ui/styles/theme.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IoMdSettings as SettingIcon } from "react-icons/io";
import { convertSelectedAPI } from "./util/convertSelectedAPI";

export interface API_ITEM {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

const Popup = () => {
  const navigate = useNavigate();

  // FIRST RENDER
  const [apiList, setAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
    host: "",
  });

  const [filteredAPIList, setFilteredAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
    host: "",
  });

  useGetAPIList({ setAPIList });
  const { data } = useGETDocs(apiList?.host);

  // INTERACTION
  // 1. 유저 > 검색어 입력
  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });
  const [selectedAPI, setSelectedAPI] = useState<RequestProps>(null);

  const onClickAPI = (api: API_ITEM) => {
    setSelectedAPI({ ...convertSelectedAPI(data, api), host: apiList.host });
  };

  useEffect(() => {
    selectedAPI &&
      navigate("/request", {
        state: {
          ...selectedAPI,
        },
      });
  }, [selectedAPI]);

  return (
    <div id="main" className={popupStyle.app}>
      <header className={popupStyle.header}>
        <div className={popupStyle.settingWrapper}>
          <button>
            <SettingIcon size={24} color="white" />
          </button>
        </div>
        <Search value={search} onChange={onChange} />
        <ul className={popupStyle.apiList}>
          {filteredAPIList.tags?.map((tag) => (
            <>
              <h2
                style={{
                  color: filteredAPIList.endpoints[tag]?.length
                    ? vars.color.white
                    : vars.color.grey,
                }}
                className={popupStyle.tag}
              >
                {tag}
              </h2>
              <li className={popupStyle.tagBox} key={tag}>
                {filteredAPIList.endpoints[tag]?.map((api) => (
                  <APIItem
                    key={api.path}
                    api={api}
                    onClick={() => onClickAPI(api)}
                  />
                ))}
              </li>
            </>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default Popup;
