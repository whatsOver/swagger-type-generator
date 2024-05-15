/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
} from "react";
import {
  DragDropContextProps,
  DraggableProps,
  DropResult,
  DroppableProps,
  DragDropContext as _DragDropContext,
  Draggable as _Draggable,
  Droppable as _Droppable,
} from "react-beautiful-dnd";
import { dragAndDropStyles } from "./styles/dragAndDrop.css";
import { vars } from "./styles/theme.css";

const DragDropContext = _DragDropContext as unknown as FC<DragDropContextProps>;
const Droppable = _Droppable as unknown as FC<DroppableProps>;
const Draggable = _Draggable as unknown as FC<DraggableProps>;

interface Props<T extends object> {
  itemList: T[];
  setItemList: Dispatch<SetStateAction<T[]>>;
  renderDragItem: (item: T) => ReactNode;
}

const DragAndDrop = <T extends object>({
  itemList,
  setItemList,
  renderDragItem,
}: Props<T>) => {
  const onDragEnd = useDragEnd(itemList, setItemList);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={dragAndDropStyles.itemWrapper}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={dragAndDropStyles.listViewStyle}
              >
                {itemList.map((item, idx) => (
                  <DragItem
                    key={idx}
                    renderDragItem={renderDragItem}
                    item={item}
                    index={idx}
                  />
                ))}
                {provided.placeholder as React.ReactElement}
              </ul>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};

export default DragAndDrop;

interface DragItemProps<T extends object> {
  item: T;
  index: number;
  renderDragItem: (item: T) => ReactNode;
}

const DragItem = <T extends object>({
  item,
  index,
  renderDragItem,
}: DragItemProps<T>) => {
  return (
    <Draggable draggableId={String(index)} index={index}>
      {(provided, snapshot) => {
        const { transform } = provided.draggableProps.style!;
        if (snapshot.isDragging) {
          const regex = /translate\((.*?)px, (.*?)px\)/;
          const transformStyle =
            Array.from(regex.exec(transform ?? "") ?? [])[0] ?? "";
          const translateY = (transformStyle.split("px")[1] ?? "0").replace(
            ",",
            ""
          );
          const translateStyle = `translate(0, ${translateY}px)`;
          return (
            <li
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                transform: translateStyle,
                backgroundColor: `${vars.color.grey}`,
                zIndex: 1,
              }}
              ref={provided.innerRef}
            >
              {renderDragItem(item)}
            </li>
          );
        }
        return (
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {renderDragItem(item)}
          </li>
        );
      }}
    </Draggable>
  );
};

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function useDragEnd<T>(data: T[], setData: Dispatch<SetStateAction<T[]>>) {
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;
      if (source.index === destination.index) return;
      const newQuotes = reorder(data, source.index, destination.index);
      setData(newQuotes);
    },
    [data, setData]
  );
  return onDragEnd;
}
