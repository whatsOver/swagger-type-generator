import { updateSequences } from "@/entities/sequence/model/sequence-store";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { SequenceItem } from "@/widgets/sequence-list/ui/item/SequenceItem";

type ReorderAPIPageProps = SequenceFunnelProps;

const ReorderSequencePage = ({
  sequenceList,
  swaggerTitle,
  onNext,
  setSequenceList,
}: ReorderAPIPageProps) => {
  const onClickSave = () => {
    updateSequences(swaggerTitle, sequenceList);
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
          itemList={sequenceList}
          onChange={setSequenceList}
          uiNode={(item) => <SequenceItem {...item} />}
          itemProps={{ height: 80, withBorder: true, withPadding: true }}
        />
      </ModeItem>
    </div>
  );
};

export default ReorderSequencePage;
