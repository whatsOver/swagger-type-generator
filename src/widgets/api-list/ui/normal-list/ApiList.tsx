import { API, ApiList } from "@/pages/content/modules/getApiList2";
import { vars } from "@/shared/ui/styles/theme.css";
import APIItem from "../../../../pages/popup/ui/APIItem/APIItem";
import { ApiListStyle } from "../apiList.css";

interface ApiListProps {
  ApiList: ApiList;
  onClickAPI: (api: API) => void;
}

const ApiList = ({ ApiList, onClickAPI }: ApiListProps) => {
  return (
    <ul className={ApiListStyle.ApiList}>
      {ApiList.tags?.map((tag) => (
        <>
          <h2
            style={{
              color: ApiList.endpoints[tag]?.length
                ? vars.color.white
                : vars.color.grey,
            }}
            className={ApiListStyle.tag}
          >
            {tag}
          </h2>
          <li className={ApiListStyle.tagBox} key={tag}>
            {ApiList.endpoints[tag]?.map((api) => (
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
