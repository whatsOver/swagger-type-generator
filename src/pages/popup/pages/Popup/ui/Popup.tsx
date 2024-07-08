import useDrawer from "@/shared/hooks/useDrawer";
import { vars } from "@/shared/ui/styles/theme.css";
import { FiMenu as MenuIcon } from "react-icons/fi";

import useHandleAuth from "@/features/auth/hooks/useHandleAuth";
import AuthModal from "@/features/auth/ui/auth-modal/AuthModal";
import useSearch from "@/features/search/module/hooks/useSearch";
import useHandleSetting from "@/pages/popup/hooks/Popup/useHandleSetting";
import Search from "@/pages/popup/ui/Search";
import SettingDrawer from "@/pages/popup/ui/SettingDrawer";
import SettingModal from "@/pages/popup/ui/SettingModal";
import BlankApi from "@/pages/popup/ui/error/BlankApi";
import Loading from "@/pages/popup/ui/loading/Loading";
import useHandlePopup from "../hooks/useHandlePopup";
import { popupStyle } from "./popup.css";
import ApiList from "@/widgets/api-list/ui/normal-list/ApiList";

const Popup = () => {
  const { loading, apiList, filteredApiList, onClickAPI, setFilteredApiList } =
    useHandlePopup();

  const { search, onChange } = useSearch({ apiList, setFilteredApiList });
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
      {!loading && !!filteredApiList.tags?.length && (
        <ApiList apiList={filteredApiList} onClickAPI={onClickAPI} />
      )}
      {!loading && !filteredApiList.tags?.length && <BlankApi />}
      <SettingDrawer isOpen={open} onClose={closeDrawer} />
    </div>
  );
};

export default Popup;
