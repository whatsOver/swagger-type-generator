import { vars } from "@src/common/ui/styles/theme.css";
import classNames from "classnames";
import { SequenceItem } from "../../store/sequence";
import { sequenceItemStyles } from "./sequenceItem.css";

export interface SequenceItemProps extends SequenceItem {
  onClick?: (id: number) => void;
}

interface ItemProps {
  id: SequenceItem["id"];
  title: SequenceItem["title"];
  apiList: SequenceItem["apiList"];
  onClick?: (id: number) => void;
}

const SequenceItem = ({ id, title, apiList, onClick }: ItemProps) => {
  return (
    <div
      onClick={() => onClick && onClick(id)}
      className={sequenceItemStyles.right}
    >
      <div className={sequenceItemStyles.title}>{title}</div>
      <div className={sequenceItemStyles.sequenceList}>
        {!apiList?.length && (
          <div className={sequenceItemStyles.blankItem}>
            <span>Empty</span>
          </div>
        )}

        {apiList?.map((api) => (
          <div
            style={{
              backgroundColor: vars.methodColors[api.api.method],
            }}
            className={classNames(sequenceItemStyles.methodItem)}
            key={api.api.path}
          >
            <span className={sequenceItemStyles.description}>
              {api.api.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SequenceItem;
