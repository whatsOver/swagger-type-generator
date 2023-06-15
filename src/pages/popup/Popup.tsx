import { popupStyle } from "./styles/popup.css";
import Search from "./ui/Search";
import useSearch from "./hooks/useSearch";
import useHandlePopup from "./hooks/Popup/useHandlePopup";
import useHandleAuth from "./hooks/Popup/useHandleAuth";
import AuthModal from "./ui/AuthModal";
import ApiList from "./ui/ApiList";
import BlankApi from "./ui/error/BlankApi";
import Loading from "./ui/loading/Loading";
import { HashLoader } from "react-spinners";

const Popup = () => {
  const { loading, apiList, filteredAPIList, onClickAPI, setFilteredAPIList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });

  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();

  return (
    <div id="main" className={popupStyle.app}>
      <header className={popupStyle.header}>
        <div className={popupStyle.settingWrapper}>
          <HashLoader color="#36d7b7" size={24} />
          {/* <button>
            <SettingIcon size={24} color="white" />
          </button> */}
          <AuthModal
            authorized={authorized}
            onChange={onChangeAuth}
            onSaveAuth={onSaveAuth}
          />
        </div>
        <Search value={search} onChange={onChange} />
        {!!loading && <Loading />}
        {!loading && !filteredAPIList.tags.length && <BlankApi />}
        {!loading && !!filteredAPIList.tags.length && (
          <ApiList apiList={filteredAPIList} onClickAPI={onClickAPI} />
        )}
      </header>
    </div>
  );
};

export default Popup;
