import useDrawer from "@/shared/hooks/useDrawer";
import { vars } from "@/shared/ui/styles/theme.css";
import { FiMenu as MenuIcon } from "react-icons/fi";

import useHandleAuth from "@/features/auth/hooks/useHandleAuth";
import AuthModal from "@/features/auth/ui/auth-modal/AuthModal";
import useSearch from "@/features/search/module/hooks/useSearch";
import useHandleSetting from "@/features/setting/module/hooks/useHandleSetting";
import SettingModal from "@/widgets/setting/ui/setting-modal/SettingModal";
import Loading from "@/shared/ui/Loading/Loading";
import Search from "@/shared/ui/search/Search";
import BlankApi from "@/widgets/api-list/ui/blank/BlankApi";
import ApiList from "@/widgets/api-list/ui/normal-list/ApiList";
import SettingDrawer from "@/widgets/setting/ui/setting-drawer/SettingDrawer";
import { useHandleApiList } from "../../../../../widgets/api-list/module/hooks/useHandleApiList";
import { apiListStyle } from "./apiList.css";

const Popup = () => {
  const { loading, apiList, filteredApiList, onClickAPI, setFilteredApiList } =
    useHandleApiList();

  const { search, onChange } = useSearch({ apiList, setFilteredApiList });
  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();
  const { withReactQuery, toggleReactQuery, onSaveSetting } =
    useHandleSetting();

  const { open, openDrawer, closeDrawer } = useDrawer();

  return (
    <div id="main" className={apiListStyle.app}>
      <header className={apiListStyle.header}>
        <div className={apiListStyle.settingWrapper}>
          <button className={apiListStyle.menuButton} onClick={openDrawer}>
            <MenuIcon size={25} color={vars.color.white} />
          </button>
          <div className={apiListStyle.settingButtonWrapper}>
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
      <div className={apiListStyle.searchWrapper}>
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
