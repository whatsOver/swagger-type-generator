import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { DocListItem } from "@/widgets/docs-list/ui/item/DocListItem";
import { useState } from "react";
import { DocsFunnelProps } from "../../DocsFunnel";

type DeleteDocsPageProps = DocsFunnelProps;

export const DeleteDocsPage = ({ docsList, onNext }: DeleteDocsPageProps) => {
  const { deleteDocs } = useDocsStore();

  const [deleteList, setDeleteList] = useState<string[]>([]);

  const onClickSave = () => {
    deleteDocs(deleteList);
    onNext();
  };

  const onClickAPI = (id: string) => {
    if (deleteList.includes(id)) {
      setDeleteList((prev) => prev.filter((item) => item !== id));
    } else {
      setDeleteList([...deleteList, id]);
    }
  };

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        showBackButton
        headerTitle="Delete Sequence"
        rightButton={
          <Button onClick={onClickSave} color="purple">
            Save
          </Button>
        }
      />
      <ModeItem>
        <ModeItem.CheckBox
          itemList={docsList}
          itemProps={{ height: 80, withPadding: true, withBorder: true }}
          onClickItem={(item) => {
            onClickAPI(item.id);
          }}
        >
          {(item) => <DocListItem item={item} />}
        </ModeItem.CheckBox>
      </ModeItem>
    </div>
  );
};
