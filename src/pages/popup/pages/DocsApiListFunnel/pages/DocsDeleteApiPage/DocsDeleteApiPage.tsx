import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { API, ApiListType } from "@/entities/docs/model/types/docs";
import { extractTagsAndEndpoints } from "@/features/extract-api/module/utils/extract-api";

import { apiListStyle } from "@/pages/popup/pages/ApiListPage/ui/apiList.css";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import APIItem from "@/widgets/api-list/ui/api-item/ApiItem";
import { useState } from "react";

interface DocsDeleteApiPageProps {
  id: string;
  onNext: () => void;
}

export const DocsDeleteApiPage = ({ id, onNext }: DocsDeleteApiPageProps) => {
  const { docsState, deletePathsFromDoc } = useDocsStore();

  const [deleteList, setDeleteList] = useState<string[]>([]);

  const apiListFromDocs = extractTagsAndEndpoints(
    docsState.docsList.find((doc) => doc.id === id)?.swaggerDocs
  );

  const apiList = convertSwaggerDocsToAPIWithKey(apiListFromDocs);

  const onClickSave = () => {
    deletePathsFromDoc(id, deleteList);
    onNext();
  };

  const onClickAPI = (key: string) => {
    if (deleteList.includes(key)) {
      setDeleteList(deleteList.filter((item) => item !== key));
    } else {
      setDeleteList([...deleteList, key]);
    }
  };

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        showBackButton
        headerTitle="Delete APIs"
        rightButton={
          <Button onClick={onClickSave} color="purple">
            Save
          </Button>
        }
      />
      <ModeItem>
        <ModeItem.CheckBox
          itemList={apiList}
          itemProps={{ height: 70, withPadding: true }}
          onClickItem={(item) => onClickAPI(item.key)}
        >
          {(item) => <APIItem key={item.key} api={item} />}
        </ModeItem.CheckBox>
      </ModeItem>
    </div>
  );
};

const convertSwaggerDocsToAPIWithKey = (
  swaggerDocs: ApiListType
): (API & { key: string })[] => {
  if (!swaggerDocs?.endpoints) {
    return [];
  }
  return Object.keys(swaggerDocs.endpoints).flatMap((tag) =>
    swaggerDocs.endpoints[tag].map((api) => ({
      key: `${api.method}-${api.path}`,
      method: api.method,
      path: api.path,
      summary: api.summary,
      description: api.description,
    }))
  );
};
