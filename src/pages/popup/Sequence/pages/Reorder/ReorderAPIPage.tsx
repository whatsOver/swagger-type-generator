import { popupStyle } from "@/pages/popup/pages/Popup/ui/popup.css";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import APIItem from "@/pages/popup/ui/APIItem/APIItem";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import { updateAPI } from "../../../../../entities/sequence/model/sequence-store";

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
