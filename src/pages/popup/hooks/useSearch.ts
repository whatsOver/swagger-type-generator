import React from "react";
import { useState } from "react";
import { APIList } from "../Popup";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { useEffect } from "react";

interface SearchProps {
  apiList: APIList;
  setFilteredAPIList: Dispatch<SetStateAction<APIList>>;
}

const useSearch = ({ apiList, setFilteredAPIList }: SearchProps) => {
  const [search, setSearch] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredAPIList((prev) => ({
      ...prev,
      endpoints: Object.keys(prev.endpoints).reduce((acc, cur) => {
        const filteredAPIs = prev.endpoints[cur].filter(
          (api) =>
            api.path.toLowerCase().includes(e.target.value.toLowerCase()) ||
            api.description.toLowerCase().includes(e.target.value.toLowerCase())
        );
        if (filteredAPIs.length > 0) {
          acc[cur] = filteredAPIs;
        }
        return acc;
      }, {}),
    }));
  };

  useEffect(() => {
    setFilteredAPIList({
      ...apiList,
      endpoints: Object.keys(apiList.endpoints).reduce((acc, cur) => {
        const filteredAPIs = apiList.endpoints[cur].filter(
          (api) =>
            api.path.toLowerCase().includes(search.toLowerCase()) ||
            api.description.toLowerCase().includes(search.toLowerCase())
        );
        if (filteredAPIs.length > 0) {
          acc[cur] = filteredAPIs;
        }
        return acc;
      }, {}),
    });
  }, [apiList, search]);

  return { search, onChange };
};

export default useSearch;
