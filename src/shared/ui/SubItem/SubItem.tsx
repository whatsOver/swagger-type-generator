/* eslint-disable react/display-name */
import {
  type ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Text } from "../Text/Text"; // 새로 만든 Text 컴포넌트 import

import {
  container,
  subItemContents,
  tabButton,
  tabContainer,
} from "./subItem.css"; // Vanilla Extract 스타일 import

export type ValidArray<T extends string> = readonly T[] | T[];
export type SubItemStatus<T extends string> = {
  [key in T]: {
    isActive: boolean;
  };
};

type SubItemProps<T extends string> = {
  name: T;
  children: ReactNode;
  onClick?: (isActive: boolean) => void;
};

type SubItemComponentProps = {
  children: ReactNode;
};

type UseSubItemProps<T extends string> = {
  steps: ValidArray<T>;
  items: string[];
};

export const useSubItem = <T extends string>({
  // 제네릭 타입 명시
  items,
  steps,
}: UseSubItemProps<T>) => {
  const [activeItem, setActiveItem] = useState<T>(steps[0]);
  const [itemStatus, setItemStatus] = useState<SubItemStatus<T>>(() => {
    const initialStatus = {} as Record<string, { isActive: boolean }>;

    steps.forEach((step) => {
      initialStatus[step as string] = {
        isActive: step === steps[0],
      };
    });

    return initialStatus as SubItemStatus<T>;
  });

  const handleItemClick = useCallback((itemName: T) => {
    setActiveItem(itemName);
    setItemStatus((prev) => {
      const newStatus = { ...prev };

      Object.keys(newStatus).forEach((key) => {
        const typedKey = key as T;
        newStatus[typedKey].isActive = false;
      });

      newStatus[itemName].isActive = true;

      return newStatus;
    });
  }, []);

  const SubItemComponent = useMemo(() => {
    return forwardRef<HTMLDivElement, SubItemComponentProps>(
      ({ children }, ref) => (
        <>
          <div ref={ref} className={container}>
            <div className={tabContainer}>
              {steps.map((step: T, idx: number) => {
                const isActive = itemStatus[step]?.isActive || false;
                return (
                  <button
                    key={step}
                    className={tabButton({
                      state: isActive ? "on" : undefined,
                    })}
                    onClick={() => handleItemClick(step)}
                    aria-selected={isActive}
                  >
                    <Text size={400}>{items[idx]}</Text>
                  </button>
                );
              })}
            </div>
          </div>
          {children}
        </>
      )
    );
  }, [itemStatus, items, steps, handleItemClick]);

  const ItemComponent = useCallback(
    ({ name, children }: SubItemProps<T>) => {
      const isActive = itemStatus[name]?.isActive || false;

      return (
        <>{isActive && <div className={subItemContents}>{children}</div>}</>
      );
    },
    [itemStatus]
  );

  const SubItem = useMemo(() => {
    return Object.assign(SubItemComponent, {
      Item: ItemComponent,
    });
  }, [activeItem]);

  return {
    SubItem,
    activeItem,
    setActiveItem: handleItemClick,
  };
};
