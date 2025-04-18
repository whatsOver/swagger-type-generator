import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { DocListItem } from "@/widgets/docs-list/ui/item/DocListItem";
import { DocsFunnelProps } from "../../DocsFunnel";

type ReorderAPIPageProps = DocsFunnelProps;

export const ReorderDocsPage = ({
  docsList,
  setDocsList,
  onNext,
}: ReorderAPIPageProps) => {
  const { updateDocsList } = useDocsStore();

  const onClickSave = () => {
    updateDocsList(docsList);
    onNext();
  };

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        showBackButton
        headerTitle="Change Order"
        rightButton={
          <Button onClick={onClickSave} color="purple">
            Save
          </Button>
        }
      />
      <ModeItem>
        <ModeItem.DragAndDrop
          itemList={docsList}
          onChange={setDocsList}
          uiNode={(item) => <DocListItem item={item} />}
          itemProps={{ height: 80, withBorder: true, withPadding: true }}
        />
      </ModeItem>
    </div>
  );
};
