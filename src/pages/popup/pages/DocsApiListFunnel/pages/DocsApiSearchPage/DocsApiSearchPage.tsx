import { APIWithOrder } from "@/entities/sequence/types/sequence";
import useSearch from "@/features/search-api/module/hooks/useSearch";
import { apiListStyle } from "@/pages/popup/pages/ApiListPage/ui/apiList.css";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import Loading from "@/shared/ui/Loading/Loading";
import Search from "@/shared/ui/search/Search";
import { useHandleApiList } from "@/widgets/api-list/module/hooks/useHandleApiList";
import BlankApi from "@/widgets/api-list/ui/blank/BlankApi";
import ToggleApiList from "@/widgets/api-list/ui/toggle-list/ToggleSwaggerApiList";

import { apiSearchStyles } from "../../../ScenarioFunnel/pages/ApiSearchPage/apiSearch.css";
import { useHandleSaveApi } from "./module/hooks/useHandleSaveApi";

interface DocsApiSearchPageProps {
  apis: APIWithOrder[];
  onNext: () => void;
}

export const DocsApiSearchPage = ({ apis, onNext }: DocsApiSearchPageProps) => {
  const { loading, apiList, filteredApiList, setFilteredApiList } =
    useHandleApiList();

  const { search, onChange } = useSearch({ apiList, setFilteredApiList });

  const { onClickAPI, onClickSave } = useHandleSaveApi({
    apis,
    onNext,
  });

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        showBackButton
        headerTitle="Add New APIs"
        rightButton={
          <Button onClick={onClickSave} color="purple">
            Save
          </Button>
        }
      />
      <div className={apiSearchStyles.searchWrapper}>
        <Search value={search} onChange={onChange} />
      </div>
      {!!loading && <Loading />}
      {!loading && !!filteredApiList.tags?.length && (
        <ToggleApiList
          ApiList={filteredApiList}
          filterApiList={apis}
          onClickAPI={onClickAPI}
        />
      )}
      {!loading && !filteredApiList.tags?.length && <BlankApi />}
    </div>
  );
};
