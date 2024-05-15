import DragAndDrop from "@src/common/ui/DragAndDrop";
import { Dispatch } from "react";
import { IoMdMenu as MenuIcon } from "react-icons/io";
import { APIWithOrder } from "../../Sequence/store/sequence";
import APIItem from "../APIItem/APIItem";
import { dragAPIStyles } from "./dragApi.css";

interface ApiListProps {
  apiList: APIWithOrder[];
  setAPIList: Dispatch<React.SetStateAction<APIWithOrder[]>>;
}

const DragAPIList = ({ apiList, setAPIList }: ApiListProps) => {
  return (
    <DragAndDrop
      itemList={apiList}
      renderDragItem={(item) => (
        <div className={dragAPIStyles.wrapper}>
          <APIItem key={item.key} api={item.api} />
          <MenuIcon size={24} color="white" />
        </div>
      )}
      setItemList={setAPIList}
    />
  );
};

export default DragAPIList;
