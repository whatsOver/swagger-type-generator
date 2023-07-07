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
import SettingModal from "./ui/SettingModal";
import useHandleSetting from "./hooks/Popup/useHandleSetting";

const Popup = () => {
  const { loading, apiList, filteredAPIList, onClickAPI, setFilteredAPIList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });
  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();
  const { withReactQuery, toggleReactQuery, onSaveSetting } =
    useHandleSetting();

  return (
    <div id="main" className={popupStyle.app}>
      <header className={popupStyle.header}>
        <div className={popupStyle.settingWrapper}>
          <HashLoader color="#36d7b7" size={24} />
          <div className={popupStyle.settingButtonWrapper}>
            <SettingModal
              withReactQuery={withReactQuery}
              toggleReactQuery={toggleReactQuery}
              onSaveSetting={onSaveSetting}
            />
            <AuthModal
              authorized={authorized}
              onChange={onChangeAuth}
              onSaveAuth={onSaveAuth}
            />
          </div>
        </div>
        <Search value={search} onChange={onChange} />
        {!!loading && <Loading />}
        {!loading && !!filteredAPIList.tags?.length && (
          <ApiList apiList={filteredAPIList} onClickAPI={onClickAPI} />
        )}
        {!loading && !filteredAPIList.tags?.length && <BlankApi />}
      </header>
    </div>
  );
};

export default Popup;
