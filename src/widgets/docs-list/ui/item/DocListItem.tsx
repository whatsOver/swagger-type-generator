import { DocItem } from "@/entities/docs/model/types/docs";
import {
  contentContainer,
  descriptionSnippetStyle,
  itemBase,
  roundBall,
  titleStyle,
} from "./docListItem.css"; // Import styles

interface DocListItemProps {
  item: DocItem;
  onClick?: (id: string) => void;
}

export const DocListItem = ({ item, onClick }: DocListItemProps) => {
  return (
    <div className={itemBase} onClick={() => onClick?.(item.id)}>
      <div className={roundBall} style={{ backgroundColor: item.color }} />
      <div className={contentContainer}>
        <span className={titleStyle}>{item.title}</span>
        {item.description && (
          <p className={descriptionSnippetStyle}>{item.description}</p>
        )}
      </div>
    </div>
  );
};
