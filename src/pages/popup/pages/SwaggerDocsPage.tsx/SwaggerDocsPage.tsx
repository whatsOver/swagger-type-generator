import useHandleAuth from "@/features/auth/hooks/useHandleAuth";
import AuthModal from "@/features/auth/ui/auth-modal/AuthModal";
import useHandleSetting from "@/features/setting/module/hooks/useHandleSetting";
import useDrawer from "@/shared/hooks/useDrawer";
import Header from "@/shared/ui/Header";
import { MENU_ICON_SIZE } from "@/shared/ui/Header/Header.constants";
import { MainTab } from "@/shared/ui/MainTab/MainTab";
import { vars } from "@/shared/ui/styles/theme.css";
import SettingDrawer from "@/widgets/setting/ui/setting-drawer/SettingDrawer";
import SettingModal from "@/widgets/setting/ui/setting-modal/SettingModal";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { Route, Routes, useLocation } from "react-router-dom";
import { ApiListPage } from "../ApiListPage/ui/ApiListPage";
import { SequenceFunnel } from "../SequenceFunnel/SequenceFunnel";
import { swaggerDocsStyle } from "./SwaggerDocsPage.css";

export const SwaggerDocsPage = () => {
  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();
  const { withReactQuery, toggleReactQuery, onSaveSetting } =
    useHandleSetting();

  const { open, openDrawer, closeDrawer } = useDrawer();

  const { pathname } = useLocation();

  console.log(pathname);

  return (
    <div id="main" className={swaggerDocsStyle.app}>
      <Header
        headerTitle="Swagger Docs"
        leftButton={
          <button className={swaggerDocsStyle.menuButton} onClick={openDrawer}>
            <MenuIcon size={MENU_ICON_SIZE} color={vars.color.white} />
          </button>
        }
        rightButton={
          <div className={swaggerDocsStyle.settingButtonWrapper}>
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
        }
      />

      <MainTab>
        <MainTab.Item to={"/"}>API List</MainTab.Item>
        <MainTab.Item to={"sequence"}>Sequence List</MainTab.Item>
      </MainTab>

      <Routes>
        <Route path="*" element={<ApiListPage />} />
        <Route path="sequence" element={<SequenceFunnel />} />
      </Routes>

      <SettingDrawer isOpen={open} onClose={closeDrawer} />
    </div>
  );
};
