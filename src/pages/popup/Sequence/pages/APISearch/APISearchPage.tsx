import Button from "@src/common/ui/Button";
import Header from "@src/common/ui/Header";
import { popupStyle } from "@src/pages/popup/pages/Popup/popup.css";
import useHandlePopup from "../../../hooks/Popup/useHandlePopup";
import useSearch from "../../../hooks/useSearch";
import { ScenarioFunnelProps } from "../../../pages/ScenarioFunnel/ScenarioFunnel";
import ToggleAPIList from "../../../ui/APIList/ToggleSwaggerAPIList";
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
  const { loading, apiList, filteredAPIList, setFilteredAPIList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });

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
      {!loading && !!filteredAPIList.tags?.length && (
        <ToggleAPIList
          apiList={filteredAPIList}
          filterAPIList={apis}
          onClickAPI={onClickAPI}
        />
      )}
      {!loading && !filteredAPIList.tags?.length && <BlankApi />}
    </div>
  );
};

export default APISearchPage;
