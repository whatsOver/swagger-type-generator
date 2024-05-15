import Button from "@src/common/ui/Button";
import Header from "@src/common/ui/Header";
import ModeItem from "@src/common/ui/ModeItem/ModeItem";
import { popupStyle } from "@src/pages/popup/pages/Popup/popup.css";
import { ScenarioFunnelProps } from "@src/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import APIItem from "@src/pages/popup/ui/APIItem/APIItem";
import { useState } from "react";
import { deleteAPIs } from "../../store/sequence";

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
