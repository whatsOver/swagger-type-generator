import { deleteSequences } from "@/entities/sequence/model/sequence-store";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { SequenceItem } from "@/widgets/sequence-list/ui/item/SequenceItem";
import { useState } from "react";

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
