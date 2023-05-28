import { vars } from "@src/common/ui/styles/theme.css";
import { popupStyle } from "../styles/popup.css";
import type { API_ITEM } from "../Popup";

interface APIItemProps {
  api: API_ITEM;
  onClick: (api: API_ITEM) => void;
}

const APIItem = ({ api, onClick }: APIItemProps) => {
  return (
    <button
      onClick={() => onClick(api)}
      style={{
        backgroundColor: vars.methodBackgroundColors[api.method],
        border: `2px solid ${vars.methodColors[api.method]}`,
      }}
      className={popupStyle.button}
      key={api.path}
    >
      <div className={popupStyle.flexRow}>
        <div
          style={{
            backgroundColor: vars.methodColors[api.method],
          }}
          className={popupStyle.methodItem}
        >
          {api.method}
        </div>
        <span className={popupStyle.path}>{api.path}</span>
      </div>
      <span className={popupStyle.description}>{api.description}</span>
    </button>
  );
};

export default APIItem;
