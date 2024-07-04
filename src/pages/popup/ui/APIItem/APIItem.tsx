import { API } from "@/pages/content/modules/getApiList2";
import { vars } from "@/shared/ui/styles/theme.css";
import { apiItemStyles } from "./apiItem.css";

interface APIItemProps {
  api: API;
  onClick?: () => void;
}

const APIItem = ({ api, onClick }: APIItemProps) => {
  return (
    <div
      onClick={() => onClick && onClick()}
      style={{
        backgroundColor: vars.methodBackgroundColors[api.method],
        border: `2px solid ${vars.methodColors[api.method]}`,
      }}
      className={apiItemStyles.button}
      key={api.path}
    >
      <div className={apiItemStyles.flexRow}>
        <div
          style={{
            backgroundColor: vars.methodColors[api.method],
          }}
          className={apiItemStyles.methodItem}
        >
          {api.method}
        </div>
        <span className={apiItemStyles.path}>{api.path}</span>
      </div>
      <span className={apiItemStyles.description}>{api.description}</span>
    </div>
  );
};

export default APIItem;
