import useDrawer from "@src/common/hooks/useDrawer";
import { vars } from "@src/common/ui/styles/theme.css";
import { FiMenu as MenuIcon } from "react-icons/fi";
import useHandleAuth from "../../hooks/Popup/useHandleAuth";
import useHandlePopup from "../../hooks/Popup/useHandlePopup";
import useHandleSetting from "../../hooks/Popup/useHandleSetting";
import useSearch from "../../hooks/useSearch";
import ApiList from "../../ui/APIList/ApiList";
import AuthModal from "../../ui/AuthModal";
import Search from "../../ui/Search";
import SettingDrawer from "../../ui/SettingDrawer";
import SettingModal from "../../ui/SettingModal";
import BlankApi from "../../ui/error/BlankApi";
import Loading from "../../ui/loading/Loading";
import { popupStyle } from "./popup.css";

const Popup = () => {
  const { loading, apiList, filteredAPIList, onClickAPI, setFilteredAPIList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ apiList, setFilteredAPIList });
  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();
  const { withReactQuery, toggleReactQuery, onSaveSetting } =
    useHandleSetting();

  const { open, openDrawer, closeDrawer } = useDrawer();

  return (
    <div id="main" className={popupStyle.app}>
      <header className={popupStyle.header}>
        <div className={popupStyle.settingWrapper}>
          <button className={popupStyle.menuButton} onClick={openDrawer}>
            <MenuIcon size={25} color={vars.color.white} />
          </button>
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
      </header>
      <div className={popupStyle.searchWrapper}>
        <Search value={search} onChange={onChange} />
      </div>
      {!!loading && <Loading />}
      {!loading && !!filteredAPIList.tags?.length && (
        <ApiList apiList={filteredAPIList} onClickAPI={onClickAPI} />
      )}
      {!loading && !filteredAPIList.tags?.length && <BlankApi />}
      <SettingDrawer isOpen={open} onClose={closeDrawer} />
    </div>
  );
};

export default Popup;
