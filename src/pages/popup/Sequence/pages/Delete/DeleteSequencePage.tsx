import Button from "@src/common/ui/Button";
import Header from "@src/common/ui/Header";
import ModeItem from "@src/common/ui/ModeItem/ModeItem";
import { popupStyle } from "@src/pages/popup/pages/Popup/popup.css";
import { SequenceFunnelProps } from "@src/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import { useState } from "react";
import { deleteSequences } from "../../store/sequence";
import SequenceItem from "../../ui/SequenceItem/SequenceItem";

type DeleteSequencePageProps = SequenceFunnelProps;

const DeleteSequencePage = ({
  sequenceList,
  swaggerTitle,
  onNext,
}: DeleteSequencePageProps) => {
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const onClickSave = () => {
    deleteSequences(swaggerTitle, deleteList);
    onNext();
  };

  const onClickAPI = (id: number) => {
    if (deleteList.includes(id)) {
      setDeleteList((prev) => prev.filter((item) => item !== id));
    } else {
      setDeleteList([...deleteList, id]);
    }
  };

  return (
    <div id="main" className={popupStyle.app}>
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
          itemList={sequenceList}
          itemProps={{ height: 80, withPadding: true, withBorder: true }}
          onClickItem={(item) => {
            onClickAPI(item.id);
            console.log(item);
          }}
        >
          {(item) => <SequenceItem {...item} />}
        </ModeItem.CheckBox>
      </ModeItem>
    </div>
  );
};

export default DeleteSequencePage;
