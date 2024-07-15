import { SequenceItemType } from "@/entities/sequence/model/sequence-store";
import ListItem from "@/shared/ui/ListItem";
import StatusIcon from "@/widgets/scenario-list/ui/icon/StatusIcon";
import { SequenceItem } from "./SequenceItem";

export interface SequenceItemProps extends SequenceItemType {
  onClick?: (id: number) => void;
}

export const SequenceItemWithStatus = ({
  apiList,
  iconType,
  id,
  title,
  onClick,
}: SequenceItemProps) => {
  return (
    <ListItem onClick={() => onClick(id)} height={80} withPadding withBorder>
      <ListItem.Left
        left={<StatusIcon iconType={iconType} />}
        middle={
          <SequenceItem
            apiList={apiList}
            id={id}
            title={title}
            onClick={onClick}
          />
        }
      />
    </ListItem>
  );
};
