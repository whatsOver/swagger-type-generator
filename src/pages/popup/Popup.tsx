import { popupStyle } from "./styles/popup.css";
import Search from "./ui/Search";
import useSearch from "./hooks/useSearch";
import { IoMdSettings as SettingIcon } from "react-icons/io";
import useHandlePopup from "./hooks/Popup/useHandlePopup";
import useHandleAuth from "./hooks/Popup/useHandleAuth";
import AuthModal from "./ui/AuthModal";
import ApiList from "./ui/ApiList";

const Popup = () => {
  const { apiList, filteredAPIList, onClickAPI, setFilteredAPIList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });

  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();

  return (
    <div id="main" className={popupStyle.app}>
      <header className={popupStyle.header}>
        <div className={popupStyle.settingWrapper}>
          <button>
            <SettingIcon size={24} color="white" />
          </button>
          <AuthModal
            authorized={authorized}
            onChange={onChangeAuth}
            onSaveAuth={onSaveAuth}
          />
        </div>
        <Search value={search} onChange={onChange} />
        {!filteredAPIList.tags.length && <BlankApiList />}
        {!!filteredAPIList.tags && (
          <ApiList apiList={filteredAPIList} onClickAPI={onClickAPI} />
        )}
      </header>
    </div>
  );
};

export default Popup;
