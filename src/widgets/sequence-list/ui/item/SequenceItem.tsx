import { vars } from "@/shared/ui/styles/theme.css";
import classNames from "classnames";

import type { SequenceItemType } from "@/entities/sequence/model/sequence-store";
import { sequenceItemStyles } from "./sequenceItem.css";

export interface SequenceItemProps extends SequenceItemType {
  onClick?: (id: number) => void;
}

interface ItemProps {
  id: SequenceItemType["id"];
  title: SequenceItemType["title"];
  apiList: SequenceItemType["apiList"];
  onClick?: (id: number) => void;
}

export const SequenceItem = ({ id, title, apiList, onClick }: ItemProps) => {
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
