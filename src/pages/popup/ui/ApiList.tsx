import { vars } from "@src/common/ui/styles/theme.css";
import { popupStyle } from "../pages/Popup/popup.css";
import { API, APIList } from "@src/pages/content/modules/getAPIList";

interface ApiListProps {
  apiList: APIList;
  onClickAPI: (api: API) => void;
}

const ApiList = ({ apiList, onClickAPI }: ApiListProps) => {
  return (
    <ul className={popupStyle.apiList}>
      {apiList.tags?.map((tag) => (
        <>
          <h2
            style={{
              color: apiList.endpoints[tag]?.length
                ? vars.color.white
                : vars.color.grey,
            }}
            className={popupStyle.tag}
          >
            {tag}
          </h2>
          <li className={popupStyle.tagBox} key={tag}>
            {apiList.endpoints[tag]?.map((api) => (
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
  );
};

export default ApiList;

interface APIItemProps {
  api: API;
  onClick: (api: API) => void;
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
