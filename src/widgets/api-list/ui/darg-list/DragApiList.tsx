import { APIWithOrder } from "@/entities/sequence/types/sequence";
import DragAndDrop from "@/shared/ui/DragAndDrop";
import { Dispatch } from "react";
import { IoMdMenu as MenuIcon } from "react-icons/io";
import APIItem from "../api-item/ApiItem";
import { dragApiStyles } from "./dragApi.css";

interface ApiListProps {
  ApiList: APIWithOrder[];
  setApiList: Dispatch<React.SetStateAction<APIWithOrder[]>>;
}

const DragApiList = ({ ApiList, setApiList }: ApiListProps) => {
  return (
    <DragAndDrop
      itemList={ApiList}
      renderDragItem={(item) => (
        <div className={dragApiStyles.wrapper}>
          <APIItem key={item.key} api={item.api} />
          <MenuIcon size={24} color="white" />
        </div>
      )}
      setItemList={setApiList}
    />
  );
};

export default DragApiList;
