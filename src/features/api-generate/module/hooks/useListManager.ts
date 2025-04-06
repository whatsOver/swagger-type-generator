import { useCallback, useState } from "react";

// 제네릭 아이템 인터페이스 (최소한 id 필드를 포함해야 함)
export interface ManagedItem {
  id: string;
  [key: string]: any; // 다른 필드들을 허용
}

export const useListManager = <T extends ManagedItem>(
  initialItems: T[] = []
) => {
  const [items, setItems] = useState<T[]>(initialItems);

  // 아이템 추가
  const addItem = useCallback((itemData: Omit<T, "id">) => {
    const newItem = {
      ...itemData,
      id: `${typeof itemData}-${Date.now()}-${Math.random()}`,
    } as T;
    setItems((prevItems) => [...prevItems, newItem]);
  }, []);

  // 아이템 삭제
  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  // 아이템 업데이트
  const updateItem = useCallback((id: string, field: keyof T, value: any) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  // 아이템 전체 업데이트 (필요시)
  const updateAllItems = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  return {
    items,
    setItems: updateAllItems, // 외부에서 전체 교체할 경우
    addItem,
    removeItem,
    updateItem,
  };
};
