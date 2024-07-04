import { API, ApiList } from "@/pages/content/modules/getApiList2";
import APIItem from "@/pages/popup/ui/APIItem/APIItem";
import CheckBox from "@/shared/ui/CheckBox";
import { vars } from "@/shared/ui/styles/theme.css";
import { APIWithOrder } from "../../../../entities/sequence/model/sequence-store";
import { ApiListStyle } from "../apiList.css";

interface ApiListProps {
  ApiList: ApiList;
  filterApiList: APIWithOrder[];
  onClickAPI: (key: string, api: API) => void;
}

const ToggleSwaggerApiList = ({
  ApiList,
  filterApiList,
  onClickAPI,
}: ApiListProps) => {
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
            {ApiList.endpoints[tag]
              ?.filter((api) =>
                filterApiList.every(
                  (item) => item.key !== `${api.method} + ${api.path}`
                )
              )
              .map((api) => (
                <CheckBox key={api.path} isChecked={false}>
                  <APIItem
                    key={api.path}
                    api={api}
                    onClick={() =>
                      onClickAPI(`${api.method} + ${api.path}`, api)
                    }
                  />
                </CheckBox>
              ))}
          </li>
        </>
      ))}
    </ul>
  );
};

export default ToggleSwaggerApiList;
