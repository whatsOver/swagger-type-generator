import useSearch from "@/features/search-api/module/hooks/useSearch";
import Loading from "@/shared/ui/Loading/Loading";
import Search from "@/shared/ui/search/Search";
import { useHandleApiList } from "@/widgets/api-list/module/hooks/useHandleApiList";
import BlankApi from "@/widgets/api-list/ui/blank/BlankApi";
import { ApiList } from "@/widgets/api-list/ui/normal-list/ApiList";

import { apiListStyle } from "./apiList.css";

export const ApiListPage = () => {
  const { loading, apiList, filteredApiList, onClickAPI, setFilteredApiList } =
    useHandleApiList();

  const { search, onChange } = useSearch({ apiList, setFilteredApiList });

  return (
    <>
      <div className={apiListStyle.searchWrapper}>
        <Search value={search} onChange={onChange} />
      </div>

      {!!loading && <Loading />}

      {!loading && !filteredApiList.tags?.length && <BlankApi />}

      {!loading && !!filteredApiList.tags?.length && (
        <ApiList apiList={filteredApiList} onClickAPI={onClickAPI} />
      )}
    </>
  );
};
