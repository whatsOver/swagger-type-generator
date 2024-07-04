import { popupStyle } from "@/pages/popup/pages/Popup/popup.css";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import useSearch from "../../../../../features/search/module/hooks/useSearch";
import ToggleApiList from "../../../../../widgets/api-list/ui/toggle-list/ToggleSwaggerApiList";
import useHandlePopup from "../../../pages/Popup/hooks/useHandlePopup";
import { ScenarioFunnelProps } from "../../../pages/ScenarioFunnel/ScenarioFunnel";
import Search from "../../../ui/Search";
import BlankApi from "../../../ui/error/BlankApi";
import Loading from "../../../ui/loading/Loading";
import useHandleSaveAPI from "../../module/useHandleSaveAPI";
import { apiSearchStyles } from "./apiSearch.css";

type APISearchPageProps = ScenarioFunnelProps;

const APISearchPage = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
  setAPIs,
}: APISearchPageProps) => {
  console.log("APISearchPage", swaggerTitle);
  const { loading, ApiList, filteredApiList, setFilteredApiList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ ApiList, setFilteredApiList });

  const { onClickAPI, onClickSave } = useHandleSaveAPI({
    apis,
    sequenceId,
    swaggerTitle,
    onNext,
    setAPIs,
  });

  return (
    <div id="main" className={popupStyle.app}>
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
