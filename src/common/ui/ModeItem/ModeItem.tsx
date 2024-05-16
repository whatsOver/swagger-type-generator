import { Dispatch, ReactNode, SetStateAction } from "react";
import { IoMenuOutline as DragIcon } from "react-icons/io5";
import CheckBox from "../CheckBox";
import DragAndDrop from "../DragAndDrop";
import ListItem, { ListItemProps } from "../ListItem";
import { width100 } from "../styles/common.css";
import { vars } from "../styles/theme.css";
import { modeItemStyles } from "./modeItem.css";

interface ModeItemProps {
  children?: ReactNode;
}

const ModeItem = (props: ModeItemProps) => {
  return <>{props.children}</>;
};

type OmitChildrenFormListProps = Omit<ListItemProps, "children">;

interface DragAndDropProps<T> {
  itemList: T[];
  setItemList: Dispatch<SetStateAction<T[]>>;
  uiNode: (item: T) => ReactNode;
  itemProps?: OmitChildrenFormListProps;
}

const DragAndDropItem = <T extends object>({
  itemList,
  setItemList,
  uiNode,
  itemProps,
}: DragAndDropProps<T>) => (
  <DragAndDrop
    itemList={itemList}
    setItemList={setItemList}
    renderDragItem={(item) => (
      <div>
        <ListItem key={String(item)} {...itemProps}>
          <ListItem.Left
            className={modeItemStyles.dragAndDropLeft}
            left={uiNode(item)}
          />
          <ListItem.Right className={modeItemStyles.dragAndDropRight}>
            <DragIcon size={30} color={vars.color.white} />
          </ListItem.Right>
        </ListItem>
      </div>
    )}
  />
);

interface CheckBoxProps<T> {
  itemList: T[];
  itemProps?: OmitChildrenFormListProps;
  children: (item: T) => ReactNode;
  onChangeItem?: (isChecked: boolean, item: T) => void;
  onClickItem?: (item: T) => void;
}

const CheckBoxItem = <T extends object>({
  itemList,
  children,
  itemProps,
  onClickItem,
}: CheckBoxProps<T>) => (
  <ul className={width100}>
    {itemList.map((item, index) => (
      <ListItem key={index} {...itemProps}>
        <ListItem.Left
          left={
            <CheckBox isChecked={false} onClick={() => onClickItem(item)}>
              {typeof children === "function" ? children(item) : null}
            </CheckBox>
          }
        />
      </ListItem>
    ))}
  </ul>
);

interface NormalProps<T> {
  itemList: T[];
}

const NormalItem = <T extends ReactNode>({ itemList }: NormalProps<T>) => (
  <ul>
    {itemList.map((item, index) => (
      <ListItem key={index}>{item}</ListItem>
    ))}
  </ul>
);

ModeItem.DragAndDrop = DragAndDropItem;
ModeItem.CheckBox = CheckBoxItem;
ModeItem.Normal = NormalItem;

export default ModeItem;
