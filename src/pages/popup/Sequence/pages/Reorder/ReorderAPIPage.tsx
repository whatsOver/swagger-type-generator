import Button from "@src/common/ui/Button";
import Header from "@src/common/ui/Header";
import ModeItem from "@src/common/ui/ModeItem/ModeItem";
import { popupStyle } from "@src/pages/popup/pages/Popup/popup.css";
import { ScenarioFunnelProps } from "@src/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import APIItem from "@src/pages/popup/ui/APIItem/APIItem";
import { updateAPI } from "../../store/sequence";

type ReorderAPIPageProps = ScenarioFunnelProps;

const ReorderAPIPage = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
  setAPIs,
}: ReorderAPIPageProps) => {
  const onClickSave = () => {
    updateAPI(swaggerTitle, Number(sequenceId), apis);
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
          itemList={apis}
          setItemList={setAPIs}
          uiNode={(item) => <APIItem key={item.key} api={item.api} />}
          itemProps={{ withPadding: true }}
        />
      </ModeItem>
    </div>
  );
};

export default ReorderAPIPage;
