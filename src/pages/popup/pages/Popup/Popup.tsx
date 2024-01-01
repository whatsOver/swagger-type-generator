import Search from "../../ui/Search";
import useSearch from "../../hooks/useSearch";
import useHandlePopup from "../../hooks/Popup/useHandlePopup";
import useHandleAuth from "../../hooks/Popup/useHandleAuth";
import AuthModal from "../../ui/AuthModal";
import ApiList from "../../ui/ApiList";
import BlankApi from "../../ui/error/BlankApi";
import Loading from "../../ui/loading/Loading";
import SettingModal from "../../ui/SettingModal";
import useHandleSetting from "../../hooks/Popup/useHandleSetting";
import useDrawer from "@src/common/hooks/useDrawer";
import { FiMenu as MenuIcon } from "react-icons/fi";
import SettingDrawer from "../../ui/SettingDrawer";
import { vars } from "@src/common/ui/styles/theme.css";
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
        <Search value={search} onChange={onChange} />
        {!!loading && <Loading />}
        {!loading && !!filteredAPIList.tags?.length && (
          <ApiList apiList={filteredAPIList} onClickAPI={onClickAPI} />
        )}
        {!loading && !filteredAPIList.tags?.length && <BlankApi />}
        <SettingDrawer isOpen={open} onClose={closeDrawer} />
      </header>
    </div>
  );
};

export default Popup;
