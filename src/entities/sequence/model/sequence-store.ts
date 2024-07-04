import { API } from "@/pages/content/modules/getApiList2";
import { storage } from "@/shared/module/storageFactory";
import { FormValues } from "../../../features/request-api/module/hooks/useForm";

export type IconType = "SUCCESS" | "FAIL" | "LOADING";

export interface APIWithKey {
  api: API;
  key: string;
  iconType: IconType;
}

export interface APIWithOrder extends APIWithKey {
  order: number;
  formValues: FormValues;
  response: unknown | null;
}

export interface SequenceItem {
  id: number;
  title: string;
  iconType: IconType;
  ApiList: APIWithOrder[];
}

interface SequenceState {
  [swaggerTitle: string]: SequenceItem[];
}

export const sequenceStorage = storage<SequenceState>("sequence", {});

type OmitId = Omit<SequenceItem, "id">;

export const createSequence = (swaggerTitle: string) => {
  sequenceStorage.set((prev) => {
    return { ...prev, [swaggerTitle]: [] };
  });
};

export const addSequence = (swaggerTitle: string, sequence: OmitId) => {
  sequenceStorage.set((prev) => {
    const lastId = prev[swaggerTitle].reduce((acc, cur) => {
      return acc > cur.id ? acc : cur.id;
    }, 0);
    const newSequence = { ...sequence, id: lastId + 1 };
    const updatedSequences = prev[swaggerTitle]
      ? [newSequence, ...prev[swaggerTitle]]
      : [newSequence];
    return { ...prev, [swaggerTitle]: updatedSequences };
  });
};

export const deleteSequences = (
  swaggerTitle: string,
  sequenceIds: number[]
) => {
  sequenceStorage.set((prev) => {
    if (!prev[swaggerTitle]) return prev;
    return {
      ...prev,
      [swaggerTitle]: prev[swaggerTitle].filter(
        (sequence) => !sequenceIds.includes(sequence.id)
      ),
    };
  });
};

export const updateSequences = (
  swaggerTitle: string,
  sequences: SequenceItem[]
) => {
  sequenceStorage.set((prev) => {
    return { ...prev, [swaggerTitle]: sequences };
  });
};

export const addAPI = (
  swaggerTitle: string,
  sequenceId: number,
  api: APIWithKey
) => {
  sequenceStorage.set((prev) => {
    if (!prev[swaggerTitle]) return prev;
    const sequence = prev[swaggerTitle].find((s) => s.id === sequenceId);
    if (!sequence) return prev;
    sequence.ApiList.push({
      ...api,
      order: sequence.ApiList.length,
      formValues: {},
      response: null,
    });
    return {
      ...prev,
      [swaggerTitle]: prev[swaggerTitle].map((s) =>
        s.id === sequenceId ? sequence : s
      ),
    };
  });
};

export const updateAPI = (
  swaggerTitle: string,
  sequenceId: number,
  apis: APIWithOrder[]
) => {
  sequenceStorage.set((prev) => {
    if (!prev[swaggerTitle]) return prev;
    return {
      ...prev,
      [swaggerTitle]: prev[swaggerTitle].map((s) =>
        s.id === sequenceId ? { ...s, ApiList: apis } : s
      ),
    };
  });
};

export const deleteAPIs = (
  swaggerTitle: string,
  sequenceId: number,
  keys: string[]
) => {
  sequenceStorage.set((prev) => {
    if (!prev[swaggerTitle]) return prev;
    const sequence = prev[swaggerTitle].find((s) => s.id === sequenceId);
    if (!sequence) return prev;
    sequence.ApiList = sequence.ApiList.filter(
      (api) => !keys.includes(api.key)
    );
    return {
      ...prev,
      [swaggerTitle]: prev[swaggerTitle].map((s) =>
        s.id === sequenceId ? sequence : s
      ),
    };
  });
};

export const updateFormValues = (
  swaggerTitle: string,
  sequenceId: number,
  key: string,
  formValues: FormValues
) => {
  sequenceStorage.set((prev) => {
    if (!prev[swaggerTitle]) return prev;
    const sequence = prev[swaggerTitle].find((s) => s.id === sequenceId);
    if (!sequence) return prev;
    sequence.ApiList = sequence.ApiList.map((api) =>
      api.key === key ? { ...api, formValues } : api
    );
    return {
      ...prev,
      [swaggerTitle]: prev[swaggerTitle].map((s) =>
        s.id === sequenceId ? sequence : s
      ),
    };
  });
};

export const updateResponse = (
  swaggerTitle: string,
  sequenceId: number,
  key: string,
  response: unknown
) => {
  sequenceStorage.set((prev) => {
    if (!prev[swaggerTitle]) return prev;
    const sequence = prev[swaggerTitle].find((s) => s.id === sequenceId);
    if (!sequence) return prev;
    sequence.ApiList = sequence.ApiList.map((api) =>
      api.key === key ? { ...api, response } : api
    );
    return {
      ...prev,
      [swaggerTitle]: prev[swaggerTitle].map((s) =>
        s.id === sequenceId ? sequence : s
      ),
    };
  });
};
