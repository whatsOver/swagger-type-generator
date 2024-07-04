import { popupStyle } from "@/pages/popup/pages/Popup/popup.css";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { updateSequences } from "../../../../../entities/sequence/model/sequence-store";
import SequenceItem from "../../ui/SequenceItem/SequenceItem";

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
    <div id="main" className={popupStyle.app}>
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
          setItemList={setSequenceList}
          uiNode={(item) => <SequenceItem {...item} />}
          itemProps={{ height: 80, withBorder: true, withPadding: true }}
        />
      </ModeItem>
    </div>
  );
};

export default ReorderSequencePage;
