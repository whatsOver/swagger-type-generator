import { useSequenceStore } from "@/entities/sequence/hooks/useSequenceStore";

import { apiListStyle } from "@/pages/popup/pages/ApiListPage/ui/apiList.css";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import Button from "@/shared/ui/Button";
import Header from "@/shared/ui/Header";
import ModeItem from "@/shared/ui/ModeItem/ModeItem";
import APIItem from "@/widgets/api-list/ui/api-item/ApiItem";
import { useState } from "react";

type DeleteApiPageProps = ScenarioFunnelProps;

export const DeleteApiPage = ({
  apis,
  sequenceId,
  swaggerTitle,
  onNext,
}: DeleteApiPageProps) => {
  const { deleteAPIs } = useSequenceStore();

  const [deleteList, setDeleteList] = useState([]);

  const onClickSave = () => {
    deleteAPIs(swaggerTitle, Number(sequenceId), deleteList);
    onNext(apis.filter((api) => !deleteList.includes(api.key)));
  };

  const onClickAPI = (key: string) => {
    if (deleteList.includes(key)) {
      setDeleteList(deleteList.filter((item) => item !== key));
    } else {
      setDeleteList([...deleteList, key]);
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
