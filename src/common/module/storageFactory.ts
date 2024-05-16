import { ChromeStorage, StorageType } from "./ChromeStorage";
import { observableFactory } from "./observableFactory";

type ValueOrUpdater<T> = T | ((prev: T) => Promise<T> | T);

export type StorageFactory<D extends object> = {
  get: () => Promise<D | null>;
  set: (value: ValueOrUpdater<D>) => Promise<void>;
  getSnapshot: () => D;
  remove: () => Promise<void>;
  clear: () => Promise<void>;
  subscribe: (cb: (state: D) => void) => () => void;
};

const chromeStorage = new ChromeStorage(StorageType.Local);

const storageFactory =
  (storage: ChromeStorage) =>
  <D extends object>(key: string, state: D): StorageFactory<D> => {
    const observable = observableFactory(state);

    const updateObservableState = async () => {
      const data = await storage.get<D>(key);

      if (data) {
        Object.keys(data).forEach((key) => {
          observable.getState()[key] = data[key];
        });
      }
    };

    updateObservableState();

    const get = async () => {
      await updateObservableState();
      return observable.getState();
    };

    const set = async (value: ValueOrUpdater<D>) => {
      const newValue =
        typeof value === "function"
          ? await value(observable.getState())
          : value;
      await storage.set(key, newValue); // Chrome Storage에 저장
      await updateObservableState(); // Observable 상태 업데이트
    };

    const getSnapshot = () => {
      return observable.getState();
    };

    const remove = async () => {
      await storage.remove(key);
    };

    const clear = async () => {
      await storage.clear();
    };

    return {
      get,
      set,
      getSnapshot,
      remove,
      clear,
      subscribe: observable.subscribe,
    };
  };

export const storage = storageFactory(chromeStorage);
