const cloneDeep = <T extends object>(x: T): T => {
  try {
    // Consider potential issues with JSON.stringify (e.g., Date objects, functions)
    return JSON.parse(JSON.stringify(x));
  } catch (e) {
    console.error("Deep clone failed", e);
    // Fallback or use a more robust deep cloning library if needed
    const newX = { ...x }; // Basic shallow clone as fallback
    return newX as T;
  }
};

const freeze = <T extends object>(state: T) => Object.freeze(cloneDeep(state));

const createDeepProxy = <T extends object>(
  target: T,
  onUpdate: () => void
): T => {
  return new Proxy(target, {
    set(obj, prop, value) {
      obj[prop] = value;
      onUpdate();
      return true;
    },
    get(obj, prop) {
      if (prop === "arguments" || prop === "caller" || prop === "callee") {
        return undefined;
      }

      if (typeof prop === "symbol") {
        return obj[prop];
      }

      const value = obj[prop];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return createDeepProxy(value, onUpdate);
      }
      return value;
    },
  });
};

const deepFreeze = <T>(obj: T): Readonly<T> => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
};

const createSnapshot = <T extends object>(state: T): Readonly<T> => {
  // Use deep cloning and deep freezing for robust immutability
  return deepFreeze(cloneDeep(state));
};

export const observableFactory = <T extends object>(initialState: T) => {
  const listeners: Set<() => void> = new Set();

  let currentState: T = cloneDeep(initialState);

  let lastSnapshot: Readonly<T> = createSnapshot(currentState);

  const subscribe = (onStoreChange: () => void): (() => void) => {
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  };

  const updateState = (newState: T) => {
    currentState = cloneDeep(newState);

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
    return cloneDeep(currentState);
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
