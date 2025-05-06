const createSnapshot = <T extends object>(state: T): Readonly<T> => {
  return structuredClone(state);
};

export const observableFactory = <T extends object>(initialState: T) => {
  const listeners: Set<() => void> = new Set();

  let currentState: T = structuredClone(initialState);

  let lastSnapshot: Readonly<T> = createSnapshot(currentState);

  const subscribe = (onStoreChange: () => void): (() => void) => {
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  };

  const updateState = (newState: T) => {
    currentState = structuredClone(newState);

    const nextSnapshot = createSnapshot(currentState);

    if (!Object.is(lastSnapshot, nextSnapshot)) {
      lastSnapshot = nextSnapshot;
      listeners.forEach((listener) => listener());
    }
  };

  const getSnapshot = (): Readonly<T> => {
    return lastSnapshot;
  };

  const getMutableState = (): T => {
    return structuredClone(currentState);
  };

  return {
    subscribe,
    getSnapshot,
    updateState,
    getMutableState,
  };
};

export type Observable<T extends object> = ReturnType<
  typeof observableFactory<T>
>;
