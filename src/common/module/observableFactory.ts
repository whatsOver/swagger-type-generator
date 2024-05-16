const cloneDeep = <T extends object>(x: T) => {
  return JSON.parse(JSON.stringify(x)) as T;
};

const freeze = <T extends object>(state: T) => Object.freeze(cloneDeep(state));

export const observableFactory = <T extends object>(initialState: T) => {
  let listeners: ((state: T) => void)[] = [];

  const proxy = new Proxy(cloneDeep(initialState), {
    set: (target, name, value) => {
      target[name] = value;
      listeners.forEach((l) => l(freeze(proxy)));
      return true;
    },
    get: (target, name) => {
      return target[name];
    },
  });

  const subscribe = (cb: (state: T) => void) => {
    listeners.push(cb);
    cb(freeze(proxy));
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  };

  return {
    getState: () => proxy,
    subscribe,
  };
};
