import { API, ApiListType } from "@/entities/docs/model/types/docs";
import BlankApi from "../blank/BlankApi";
import { ApiList } from "../normal-list/ApiList";

interface DocsApiListProps {
  apiList: ApiListType;
  onClickAPI: (api: API) => void;
}

export const DocsApiList = ({ apiList, onClickAPI }: DocsApiListProps) => {
  return (
    <>
      {!apiList.tags?.length && (
        <BlankApi>
          There is no API
          <br />
          Please add API with the &quot;Add&quot; button.
        </BlankApi>
      )}
      {!!apiList.tags?.length && (
        <ApiList apiList={apiList} onClickAPI={onClickAPI} />
      )}
    </>
  );
};
