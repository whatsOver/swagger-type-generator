import APIItem from "@/pages/popup/ui/APIItem/APIItem";
import ListItem from "@/shared/ui/ListItem";
import { APIWithOrder } from "../../../../../entities/sequence/model/sequence-store";
import StatusIcon from "../StatusIcon/StatusIcon";

interface ScenarioItemProps {
  api: APIWithOrder;
  onClick: () => void;
}

const ScenarioItem = ({ api, onClick }: ScenarioItemProps) => {
  return (
    <ListItem onClick={onClick} height={80} withPadding>
      <ListItem.Left
        left={<StatusIcon iconType={api.iconType} />}
        middle={<APIItem api={api.api} />}
      />
    </ListItem>
  );
};

export default ScenarioItem;
