import { useMemo, useSyncExternalStore } from "react";
import { storage, StorageFactory } from "../module/storageFactory";

/**
 * 크롬 스토리지의 상태를 React 컴포넌트와 동기화하는 커스텀 훅
 *
 * @param factory 스토리지 팩토리 인스턴스
 * @returns 최신 스토리지 상태
 */
export function useStorage<T extends object>(factory: StorageFactory<T>): T {
  return useSyncExternalStore(factory.subscribe, factory.getSnapshot);
}

/**
 * 특정 키에 대한 크롬 스토리지 상태를 React 컴포넌트와 동기화하는 커스텀 훅
 *
 * @param key 스토리지 키
 * @param initialState 초기 상태
 * @returns 최신 스토리지 상태와 업데이트 함수
 */
export function useKeyStorage<T extends object>(
  key: string,
  initialState: T
): [T, (value: T | ((prev: T) => T)) => Promise<void>] {
  const storageInstance = useMemo(() => storage<T>(key, initialState), [key]);
  const state = useStorage(storageInstance);

  const setState = useMemo(
    () =>
      async (value: T | ((prev: T) => T)): Promise<void> => {
        await storageInstance.set(
          typeof value === "function"
            ? (prev) => (value as (prev: T) => T)(prev)
            : value
        );
      },
    [storageInstance]
  );

  return [state, setState];
}
