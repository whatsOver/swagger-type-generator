import { vars } from "@/shared/ui/styles/theme.css";
import classNames from "classnames";

import type { SequenceItem } from "../../../../../entities/sequence/model/sequence-store";
import { sequenceItemStyles } from "./sequenceItem.css";

export interface SequenceItemProps extends SequenceItem {
  onClick?: (id: number) => void;
}

interface ItemProps {
  id: SequenceItem["id"];
  title: SequenceItem["title"];
  ApiList: SequenceItem["ApiList"];
  onClick?: (id: number) => void;
}

const SequenceItem = ({ id, title, ApiList, onClick }: ItemProps) => {
  return (
    <div
      onClick={() => onClick && onClick(id)}
      className={sequenceItemStyles.right}
    >
      <div className={sequenceItemStyles.title}>{title}</div>
      <div className={sequenceItemStyles.sequenceList}>
        {!ApiList?.length && (
          <div className={sequenceItemStyles.blankItem}>
            <span>Empty</span>
          </div>
        )}

        {ApiList?.map((api) => (
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
