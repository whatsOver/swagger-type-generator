import { APIWithOrder } from "@/entities/sequence/types/sequence";
import ListItem from "@/shared/ui/ListItem";
import APIItem from "@/widgets/api-list/ui/api-item/ApiItem";
import StatusIcon from "../icon/StatusIcon";

interface ScenarioItemProps {
  api: APIWithOrder;
  onClick?: () => void;
  withPadding?: boolean;
  showStatus?: boolean;
}

export const ScenarioItem = ({
  api,
  onClick,
  withPadding = true,
  showStatus = true,
}: ScenarioItemProps) => {
  return (
    <ListItem onClick={onClick} height={80} withPadding={withPadding}>
      <ListItem.Left
        left={showStatus && <StatusIcon iconType={api.iconType} />}
        middle={<APIItem api={api.api} />}
      />
    </ListItem>
  );
};
