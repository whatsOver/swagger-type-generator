import { useState } from "react";
import { popupStyle } from "./styles/popup.css";
import Search from "./ui/Search";
import APIItem from "./ui/APIItem";
import useGetAPIList from "./hooks/useGetAPIList";
import useSearch from "./hooks/useSearch";
import { useGETDocs } from "./api/docs";
import { RequestProps } from "./ui/Request";
import { vars } from "@src/common/ui/styles/theme.css";
import { Method } from "axios";
import { useNavigate } from "react-router-dom";

export interface API {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

export interface APIList {
  endpoints: {
    [key: string]: API[];
  };
  tags: string[];
}

const Popup = () => {
  const { data } = useGETDocs();
  const navigate = useNavigate();

  // FIRST RENDER
  const [apiList, setAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
  });

  const [filteredAPIList, setFilteredAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
  });

  useGetAPIList({ setAPIList });

  // INTERACTION
  // 1. 유저 > 검색어 입력
  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });
  const [selectedAPI, setSelectedAPI] = useState<RequestProps>(null);

  const onClickAPI = (api: API) => {
    const removeIs = (str: string) => str.split(" ")[0];
    const method = removeIs(api.method) as Method;
    setSelectedAPI((prev) => ({
      ...prev,
      method,
      path: api.path,
    }));
    if (data) {
      const parameter =
        data.paths[api.path][method.toLowerCase() as Method].parameters;
      setSelectedAPI((prev) => ({
        ...prev,
        params: parameter,
      }));
      if (data.paths[api.path][method.toLowerCase()].requestBody) {
        const schemaName =
          data.paths[api.path][
            method.toLowerCase() as Method
          ].requestBody.content["application/json"].schema.$ref.split("/")[3];
        const body = data.components.schemas[schemaName];
        setSelectedAPI((prev) => ({
          ...prev,
          body,
        }));
      }
    }
    navigate("/request", {
      state: {
        method,
        path: api.path,
        params: selectedAPI.params,
        body: selectedAPI.body,
      },
    });
  };

  return (
    <div className={popupStyle.app}>
      <header className={popupStyle.header}>
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
