import ListItem from "@/shared/ui/ListItem";
import StatusIcon from "../StatusIcon/StatusIcon";
import SequenceItem from "./SequenceItem";

export interface SequenceItemProps extends SequenceItem {
  onClick?: (id: number) => void;
}

const SequenceItemWithStatus = ({
  ApiList,
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
            ApiList={ApiList}
            id={id}
            title={title}
            onClick={onClick}
          />
        }
      />
    </ListItem>
  );
};

export default SequenceItemWithStatus;
