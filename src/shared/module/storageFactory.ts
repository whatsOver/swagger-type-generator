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

// 깊은 병합을 위한 유틸리티 함수
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

const isObject = (item: unknown): item is object => {
  return item && typeof item === "object" && !Array.isArray(item);
};

// 스토리지 인스턴스 캐시를 위한 맵
const storageInstances = new Map<string, StorageFactory<any>>();

const storageFactory =
  (storage: ChromeStorage) =>
  <D extends object>(key: string, state: D): StorageFactory<D> => {
    // 이미 생성된 인스턴스가 있다면 반환
    const cachedInstance = storageInstances.get(key);
    if (cachedInstance) {
      return cachedInstance as StorageFactory<D>;
    }

    const observable = observableFactory<D>(state);

    // 상태 업데이트 플래그
    let isUpdating = false;

    const updateObservableState = async (): Promise<void> => {
      if (isUpdating) return;

      try {
        isUpdating = true;

        const data = await storage.get<D>(key);

        if (data) {
          // 현재 상태를 가져옴
          const currentState = observable.getState();

          // 깊은 병합을 사용하여 데이터 업데이트
          const mergedState = deepMerge(currentState, data);

          // 상태 완전히 교체하기
          Object.keys(currentState).forEach((key) => {
            delete currentState[key];
          });

          // 병합된 상태로 모든 속성 복사
          Object.entries(mergedState).forEach(([key, value]) => {
            currentState[key] = value;
          });

          observable.notifyListeners();
        }
      } finally {
        observable.notifyListeners();
        isUpdating = false;
      }
    };

    // 초기 상태 로드
    updateObservableState();

    const get = async (): Promise<D | null> => {
      await updateObservableState();
      return observable.getState();
    };

    const set = async (value: ValueOrUpdater<D>): Promise<void> => {
      try {
        // 새 값 계산
        const newValue =
          typeof value === "function"
            ? await value(observable.getState())
            : value;

        // 크롬 스토리지에 저장
        await storage.set(key, newValue);

        // 옵저버블 상태 업데이트 (스토리지에서 데이터를 다시 가져와서 상태 갱신)
        await updateObservableState();

        // 모든 구독자에게 강제로 알림을 보냄

        observable.notifyListeners();
      } catch (error) {
        console.error(`[${key}] 상태 업데이트 중 오류:`, error);
        throw error;
      }
    };

    const getSnapshot = () => {
      const snapshot = observable.getState();
      // logState(`[${key}] getSnapshot 호출됨`, snapshot);
      return snapshot;
    };

    const remove = async () => {
      await storage.remove(key);
    };

    const clear = async () => {
      await storage.clear();
    };

    // 생성된 인스턴스를 반환
    const instance = {
      get,
      set,
      getSnapshot,
      remove,
      clear,
      subscribe: observable.subscribe,
    };

    // 인스턴스를 캐시에 저장
    storageInstances.set(key, instance);

    return instance;
  };

export const storage = storageFactory(chromeStorage);
