import { vars } from "@/shared/ui/styles/theme.css";
import CheckBox from "@/shared/ui/CheckBox";
import { API, APIList } from "@/pages/content/modules/getAPIList";
import APIItem from "@/pages/popup/ui/APIItem/APIItem";
import { APIWithOrder } from "../../Sequence/store/sequence";
import { popupStyle } from "../../pages/Popup/popup.css";

interface ApiListProps {
  apiList: APIList;
  filterAPIList: APIWithOrder[];
  onClickAPI: (key: string, api: API) => void;
}

const ToggleSwaggerAPIList = ({
  apiList,
  filterAPIList,
  onClickAPI,
}: ApiListProps) => {
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
            {apiList.endpoints[tag]
              ?.filter((api) =>
                filterAPIList.every(
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

export default ToggleSwaggerAPIList;
