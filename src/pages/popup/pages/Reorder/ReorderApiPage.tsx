import { updateAPI } from "@/entities/sequence/model/sequence-store";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import APIItem from "@/widgets/api-list/ui/api-item/ApiItem";

type ReorderApiPageProps = ScenarioFunnelProps;

const ReorderApiPage = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
  setAPIs,
}: ReorderApiPageProps) => {
  const onClickSave = () => {
    updateAPI(swaggerTitle, Number(sequenceId), apis);
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
          itemList={apis}
          setItemList={setAPIs}
          uiNode={(item) => <APIItem key={item.key} api={item.api} />}
          itemProps={{ withPadding: true }}
        />
      </ModeItem>
    </div>
  );
};

export default ReorderApiPage;
