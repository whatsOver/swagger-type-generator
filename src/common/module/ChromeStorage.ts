export enum StorageType {
  Local = "local",
  Sync = "sync",
  Managed = "managed",
  Session = "session",
}

export class ChromeStorage {
  type: StorageType;

  constructor(type: StorageType) {
    this.type = type;
  }

  async get<T>(key: string): Promise<T | null> {
    const rawValue = await chrome.storage[this.type].get([key]);
    return rawValue[key] === undefined
      ? null
      : (JSON.parse(rawValue[key]) as T);
  }

  async set<T>(key: string, value: T): Promise<void> {
    chrome.storage[this.type].set({ [key]: JSON.stringify(value) });
  }

  remove = (key: string) => {
    return new Promise((resolve) => {
      chrome.storage[this.type].remove(key, () => {
        resolve("success");
      });
    });
  };

  clear = () => {
    return new Promise((resolve) => {
      chrome.storage[this.type].clear(() => {
        resolve("success");
      });
    });
  };
}
