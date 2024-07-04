import { popupStyle } from "@/pages/popup/pages/Popup/popup.css";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import APIItem from "@/pages/popup/ui/APIItem/APIItem";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { useState } from "react";
import { deleteAPIs } from "../../../../../entities/sequence/model/sequence-store";

type DeleteAPIPageProps = ScenarioFunnelProps;

const DeleteAPIPage = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
}: DeleteAPIPageProps) => {
  const [deleteList, setDeleteList] = useState([]);
  const onClickSave = () => {
    deleteAPIs(swaggerTitle, Number(sequenceId), deleteList);
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
          itemList={apis}
          itemProps={{ height: 70, withPadding: true }}
          onClickItem={(item) => onClickAPI(item.key)}
        >
          {(item) => <APIItem key={item.key} api={item.api} />}
        </ModeItem.CheckBox>
      </ModeItem>
    </div>
  );
};

export default DeleteAPIPage;
