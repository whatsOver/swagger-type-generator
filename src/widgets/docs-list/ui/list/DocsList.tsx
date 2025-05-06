import { DocItem } from "@/entities/docs/model/types/docs";
import { DocListItem } from "../item/DocListItem";
import { emptyListStyle, listContainerStyle } from "./docsList.css";

interface DocsListProps {
  docsList: DocItem[];
  onItemClick: (id: string) => void;
}

const DocsList = ({ docsList, onItemClick }: DocsListProps) => {
  return (
    <div className={listContainerStyle}>
      {docsList.length > 0 ? (
        docsList.map((doc) => (
          <DocListItem key={doc.id} item={doc} onClick={onItemClick} />
        ))
      ) : (
        <div className={emptyListStyle}>There is no document.</div>
      )}
    </div>
  );
};

export default DocsList;
