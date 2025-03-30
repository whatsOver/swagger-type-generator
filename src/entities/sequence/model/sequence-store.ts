import { API } from "@/entities/docs/model/types/docs";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import { storage } from "@/shared/module/storageFactory";

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
  request: unknown | null;
}

export interface SequenceItemType {
  id: number;
  title: string;
  iconType: IconType;
  apiList: APIWithOrder[];
}

export interface SequenceState {
  [swaggerTitle: string]: SequenceItemType[];
}

export const sequenceStorage = storage<SequenceState>("sequence", {});

export type { FormValues };

type OmitId = Omit<SequenceItemType, "id">;

export const createSequence = async (swaggerTitle: string) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    updatedState[swaggerTitle] = updatedState[swaggerTitle] || [];
    return updatedState;
  });
};

export const addSequence = async (swaggerTitle: string, sequence: OmitId) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    const sequences = [...(updatedState[swaggerTitle] || [])];

    const lastId =
      sequences.length > 0 ? Math.max(...sequences.map((seq) => seq.id), 0) : 0;

    const newSequence = { ...sequence, id: lastId + 1 };
    updatedState[swaggerTitle] = [newSequence, ...sequences];

    return updatedState;
  });
};

export const deleteSequences = async (
  swaggerTitle: string,
  sequenceIds: number[]
) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    if (!updatedState[swaggerTitle]) return updatedState;

    updatedState[swaggerTitle] = updatedState[swaggerTitle].filter(
      (sequence) => !sequenceIds.includes(sequence.id)
    );

    return updatedState;
  });
};

export const updateSequences = async (
  swaggerTitle: string,
  sequences: SequenceItemType[]
) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    updatedState[swaggerTitle] = [...sequences];
    return updatedState;
  });
};

export const addAPI = async (
  swaggerTitle: string,
  sequenceId: number,
  api: APIWithKey
) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    if (!updatedState[swaggerTitle]) return updatedState;

    const sequenceIndex = updatedState[swaggerTitle].findIndex(
      (s) => s.id === sequenceId
    );

    if (sequenceIndex === -1) return updatedState;

    // 불변성을 유지하며 시퀀스 배열 복사
    updatedState[swaggerTitle] = [...updatedState[swaggerTitle]];

    // 시퀀스 객체 복사
    const sequence = {
      ...updatedState[swaggerTitle][sequenceIndex],
      apiList: [...updatedState[swaggerTitle][sequenceIndex].apiList],
    };

    // 새 API 추가
    sequence.apiList.push({
      ...api,
      order: sequence.apiList.length,
      formValues: {},
      response: null,
      request: null,
    });

    // 업데이트된 시퀀스로 교체
    updatedState[swaggerTitle][sequenceIndex] = sequence;

    return updatedState;
  });
};

export const updateAPI = async (
  swaggerTitle: string,
  sequenceId: number,
  apis: APIWithOrder[]
) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    if (!updatedState[swaggerTitle]) return updatedState;

    const sequenceIndex = updatedState[swaggerTitle].findIndex(
      (s) => s.id === sequenceId
    );

    if (sequenceIndex === -1) return updatedState;

    updatedState[swaggerTitle] = [...updatedState[swaggerTitle]];
    updatedState[swaggerTitle][sequenceIndex] = {
      ...updatedState[swaggerTitle][sequenceIndex],
      apiList: [...apis],
    };

    return updatedState;
  });
};

export const deleteAPIs = async (
  swaggerTitle: string,
  sequenceId: number,
  keys: string[]
) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    if (!updatedState[swaggerTitle]) return updatedState;

    const sequenceIndex = updatedState[swaggerTitle].findIndex(
      (s) => s.id === sequenceId
    );

    if (sequenceIndex === -1) return updatedState;

    updatedState[swaggerTitle] = [...updatedState[swaggerTitle]];
    updatedState[swaggerTitle][sequenceIndex] = {
      ...updatedState[swaggerTitle][sequenceIndex],
      apiList: updatedState[swaggerTitle][sequenceIndex].apiList.filter(
        (api) => !keys.includes(api.key)
      ),
    };

    return updatedState;
  });
};

export const updateFormValues = async (
  swaggerTitle: string,
  sequenceId: number,
  key: string,
  formValues: FormValues
) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    if (!updatedState[swaggerTitle]) return updatedState;

    const sequenceIndex = updatedState[swaggerTitle].findIndex(
      (s) => s.id === sequenceId
    );

    if (sequenceIndex === -1) return updatedState;

    // 불변성을 유지하며 시퀀스 배열 및 객체 복사
    updatedState[swaggerTitle] = [...updatedState[swaggerTitle]];
    const sequence: SequenceItemType = {
      ...updatedState[swaggerTitle][sequenceIndex],
      apiList: [...updatedState[swaggerTitle][sequenceIndex].apiList],
    };

    // API 리스트 업데이트
    sequence.apiList = sequence.apiList.map((api) =>
      api.key === key ? { ...api, formValues: { ...formValues } } : api
    );

    // 업데이트된 시퀀스로 교체
    updatedState[swaggerTitle][sequenceIndex] = sequence;

    return updatedState;
  });
};

interface UpdateResponseProps {
  swaggerTitle: string;
  sequenceId: number;
  key: string;
  response: unknown;
  request: unknown;
}

export const updateResponse = async ({
  swaggerTitle,
  sequenceId,
  key,
  response,
  request,
}: UpdateResponseProps) => {
  await sequenceStorage.set((prev) => {
    const updatedState = { ...prev };
    if (!updatedState[swaggerTitle]) return updatedState;

    const sequenceIndex = updatedState[swaggerTitle].findIndex(
      (s) => s.id === sequenceId
    );

    if (sequenceIndex === -1) return updatedState;

    // 불변성을 유지하며 시퀀스 배열 및 객체 복사
    updatedState[swaggerTitle] = [...updatedState[swaggerTitle]];
    const sequence: SequenceItemType = {
      ...updatedState[swaggerTitle][sequenceIndex],
      apiList: [...updatedState[swaggerTitle][sequenceIndex].apiList],
    };

    // API 리스트 업데이트
    sequence.apiList = sequence.apiList.map((api) =>
      api.key === key ? { ...api, response, request, iconType: "SUCCESS" } : api
    );

    // 업데이트된 시퀀스로 교체
    updatedState[swaggerTitle][sequenceIndex] = sequence;

    return updatedState;
  });
};
