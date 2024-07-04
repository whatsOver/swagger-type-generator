import DragAndDrop from "@/shared/ui/DragAndDrop";
import { Dispatch } from "react";
import { IoMdMenu as MenuIcon } from "react-icons/io";
import { APIWithOrder } from "../../../../entities/sequence/model/sequence-store";
import APIItem from "../../../../pages/popup/ui/APIItem/APIItem";
import { dragAPIStyles } from "./dragApi.css";

interface ApiListProps {
  ApiList: APIWithOrder[];
  setApiList: Dispatch<React.SetStateAction<APIWithOrder[]>>;
}

const DragApiList = ({ ApiList, setApiList }: ApiListProps) => {
  return (
    <DragAndDrop
      itemList={ApiList}
      renderDragItem={(item) => (
        <div className={dragAPIStyles.wrapper}>
          <APIItem key={item.key} api={item.api} />
          <MenuIcon size={24} color="white" />
        </div>
      )}
      setItemList={setApiList}
    />
  );
};

export default DragApiList;
