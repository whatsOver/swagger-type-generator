import useSearch from "@/features/search-api/module/hooks/useSearch";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import Loading from "@/shared/ui/Loading/Loading";
import Search from "@/shared/ui/search/Search";
import { useHandleApiList } from "@/widgets/api-list/module/hooks/useHandleApiList";
import BlankApi from "@/widgets/api-list/ui/blank/BlankApi";
import ToggleApiList from "@/widgets/api-list/ui/toggle-list/ToggleSwaggerApiList";
import { apiSearchStyles } from "./apiSearch.css";
import { useHandleSaveAPI } from "./module/hooks/useHandleSaveAPI";

type APISearchPageProps = ScenarioFunnelProps;

const APISearchPage = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
  setAPIs,
}: APISearchPageProps) => {
  const { loading, apiList, filteredApiList, setFilteredApiList } =
    useHandleApiList();

  const { search, onChange } = useSearch({ apiList, setFilteredApiList });

  const { onClickAPI, onClickSave } = useHandleSaveAPI({
    apis,
    sequenceId,
    swaggerTitle,
    onNext,
    setAPIs,
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

export default APISearchPage;
