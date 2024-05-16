import ListItem from "@src/common/ui/ListItem";
import APIItem from "@src/pages/popup/ui/APIItem/APIItem";
import { APIWithOrder } from "../../store/sequence";
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
