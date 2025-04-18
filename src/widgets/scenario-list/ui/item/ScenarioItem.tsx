import { APIWithOrder } from "@/entities/sequence/types/sequence";
import ListItem from "@/shared/ui/ListItem";
import APIItem from "@/widgets/api-list/ui/api-item/ApiItem";
import StatusIcon from "../icon/StatusIcon";

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
