import { ChromeStorage, StorageType } from "./ChromeStorage";
import { Observable, observableFactory } from "./observableFactory";

type ValueOrUpdater<T> = T | ((prev: T) => Promise<T> | T);

export type StorageFactory<D extends object> = {
  get: () => Promise<Readonly<D> | null>;
  set: (value: ValueOrUpdater<D>) => Promise<void>;
  getSnapshot: () => Readonly<D>;
  remove: () => Promise<void>;
  clear: () => Promise<void>;
  subscribe: (cb: () => void) => () => void;
};

const chromeStorage = new ChromeStorage(StorageType.Local);
// Define the area name based on the storage instance type
const storageAreaName = StorageType.Local; // Assuming Local for now

// 깊은 병합을 위한 유틸리티 함수
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target };

  const isObject = (item: unknown): item is object => {
    return item && typeof item === "object" && !Array.isArray(item);
  };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (isObject(sourceValue) && isObject(targetValue)) {
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    });
  }

  return output;
};

// 스토리지 인스턴스 캐시를 위한 맵
const storageInstances = new Map<string, StorageFactory<any>>();

const storageFactory =
  (storage: ChromeStorage) =>
  <D extends object>(key: string, initialState: D): StorageFactory<D> => {
    const cachedInstance = storageInstances.get(key);
    if (cachedInstance) {
      return cachedInstance as StorageFactory<D>;
    }

    const observable: Observable<D> = observableFactory<D>(initialState);

    let isUpdatingFromStorage = false;

    const updateObservableStateFromStorage = async (): Promise<void> => {
      if (isUpdatingFromStorage) return;
      isUpdatingFromStorage = true;

      try {
        const dataFromStorage = await storage.get<D>(key);

        if (dataFromStorage) {
          const currentMutableState = observable.getMutableState();
          const mergedState = deepMerge(currentMutableState, dataFromStorage);
          observable.updateState(mergedState);
        } else {
          if (
            JSON.stringify(observable.getSnapshot()) !==
            JSON.stringify(initialState)
          ) {
            observable.updateState(initialState);
          }
        }
      } catch (error) {
        console.error(
          `[${key}] Error fetching/updating state from storage:`,
          error
        );
      } finally {
        isUpdatingFromStorage = false;
      }
    };

    updateObservableStateFromStorage();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === storageAreaName && changes[key]) {
        console.log(`[${key}] Storage changed externally, updating state...`);
        updateObservableStateFromStorage();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    const get = async (): Promise<Readonly<D> | null> => {
      return observable.getSnapshot();
    };

    const set = async (value: ValueOrUpdater<D>): Promise<void> => {
      try {
        const currentMutableState = observable.getMutableState();
        const newValue =
          typeof value === "function"
            ? await (value as (prev: D) => Promise<D> | D)(currentMutableState)
            : value;

        await storage.set(key, newValue);

        observable.updateState(newValue);
      } catch (error) {
        console.error(`[${key}] Error setting state:`, error);
        throw error;
      }
    };

    const getSnapshot = observable.getSnapshot;
    const subscribe = observable.subscribe;

    const remove = async () => {
      await storage.remove(key);
      observable.updateState(initialState);
    };

    const clear = async () => {
      await storage.clear();
      observable.updateState(initialState);
    };

    const instance: StorageFactory<D> = {
      get,
      set,
      getSnapshot,
      remove,
      clear,
      subscribe,
    };

    storageInstances.set(key, instance);
    return instance;
  };

export const storage = storageFactory(chromeStorage);
