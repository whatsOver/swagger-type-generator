import { useEffect, useState } from "react";
import { popupStyle } from "./styles/popup.css";
import { vars } from "./styles/theme.css";
import Search from "./ui/Search";
import APIItem from "./ui/APIItem";
import useGetAPIList from "./hooks/useGetAPIList";
import useSearch from "./hooks/useSearch";

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
                  <APIItem api={api} />
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
