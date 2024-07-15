import type { ApiList } from "@/entities/docs/model/types/docs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SearchProps {
  apiList: ApiList;
  setFilteredApiList: Dispatch<SetStateAction<ApiList>>;
}

const useSearch = ({ apiList, setFilteredApiList }: SearchProps) => {
  const [search, setSearch] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredApiList((prev) => ({
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
    setFilteredApiList({
      ...apiList,
      endpoints: Object.keys(apiList.endpoints).reduce((acc, cur) => {
        const filteredAPIs = apiList.endpoints[cur].filter(
          (api) =>
            api.path?.toLowerCase().includes(search.toLowerCase()) ||
            api.description?.toLowerCase().includes(search.toLowerCase())
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
