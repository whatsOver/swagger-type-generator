import { vars } from "../styles/theme.css";
import { API } from "../Popup";
import { popupStyle } from "../styles/popup.css";

interface APIItemProps {
  api: API;
}

const APIItem = ({ api }: APIItemProps) => {
  return (
    <button
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
