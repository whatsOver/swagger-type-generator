import { popupStyle } from "./styles/popup.css";
import Search from "./ui/Search";
import APIItem from "./ui/APIItem";
import useSearch from "./hooks/useSearch";
import { vars } from "@src/common/ui/styles/theme.css";
import { IoMdSettings as SettingIcon } from "react-icons/io";
import useHandlePopup from "./hooks/Popup/useHandlePopup";
import useHandleAuth from "./hooks/Popup/useHandleAuth";
import AuthModal from "./ui/AuthModal";

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
        <ul className={popupStyle.apiList}>
          {filteredAPIList.tags?.map((tag) => (
            <>
              <h2
                style={{
                  color: filteredAPIList.endpoints[tag]?.length
                    ? vars.color.white
                    : vars.color.grey,
                }}
                className={popupStyle.tag}
              >
                {tag}
              </h2>
              <li className={popupStyle.tagBox} key={tag}>
                {filteredAPIList.endpoints[tag]?.map((api) => (
                  <APIItem
                    key={api.path}
                    api={api}
                    onClick={() => onClickAPI(api)}
                  />
                ))}
              </li>
            </>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default Popup;
