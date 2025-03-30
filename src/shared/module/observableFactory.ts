const cloneDeep = <T extends object>(x: T) => {
  return JSON.parse(JSON.stringify(x)) as T;
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

export const observableFactory = <T extends object>(initialState: T) => {
  let listeners: ((state: T) => void)[] = [];

  // 구독자 추가를 처리하는 안정적인 함수
  const addListener = (cb: (state: T) => void) => {
    listeners.push(cb);
    cb(freeze(proxy));
  };

  // 구독 취소를 처리하는 안정적인 함수
  const removeListener = (cb: (state: T) => void) => {
    listeners = listeners.filter((l) => l !== cb);
  };

  const notifyListeners = () => {
    const frozenState = freeze(proxy);
    listeners.forEach((l) => {
      try {
        l(frozenState);
      } catch (error) {
        console.error("리스너 호출 중 오류:", error);
      }
    });
  };

  const proxy = createDeepProxy(cloneDeep(initialState), notifyListeners);

  // 안정적인 구독 함수 (모든 렌더링에서 동일하게 유지됨)
  const subscribe = (cb: (state: T) => void) => {
    addListener(cb);

    // 구독 취소 함수도 항상 동일한 참조 보장
    return () => removeListener(cb);
  };

  const getState = () => {
    return proxy;
  };

  return {
    getState,
    subscribe,
    notifyListeners,
  };
};
