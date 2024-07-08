import { API, ApiList } from "@/pages/content/modules/getApiList";
import { vars } from "@/shared/ui/styles/theme.css";
import APIItem from "../../../../pages/popup/ui/APIItem/APIItem";
import { ApiListStyle } from "../apiList.css";

interface ApiListProps {
  apiList: ApiList;
  onClickAPI: (api: API) => void;
}

const ApiList = ({ apiList, onClickAPI }: ApiListProps) => {
  return (
    <ul className={ApiListStyle.ApiList}>
      {apiList.tags?.map((tag) => (
        <>
          <h2
            style={{
              color: apiList.endpoints[tag]?.length
                ? vars.color.white
                : vars.color.grey,
            }}
            className={ApiListStyle.tag}
          >
            {tag}
          </h2>
          <li className={ApiListStyle.tagBox} key={tag}>
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
