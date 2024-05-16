import { vars } from "@src/common/ui/styles/theme.css";
import { API, APIList } from "@src/pages/content/modules/getAPIList";
import APIItem from "@src/pages/popup/ui/APIItem/APIItem";
import { popupStyle } from "../../pages/Popup/popup.css";

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
