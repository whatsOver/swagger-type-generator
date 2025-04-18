import { FormValues } from "@/features/request-api/module/hooks/useForm";
import { useKeyStorage } from "@/shared/hooks/useStorage";
import { useCallback } from "react";
import {
  APIWithKey,
  APIWithOrder,
  SequenceItemType,
  SequenceState,
} from "../types/sequence";

/**
 * 시퀀스 스토리지와 연동하는 커스텀 훅
 *
 * @returns 시퀀스 관련 상태와 업데이트 함수들
 */
export function useSequenceStore() {
  const [sequences, setSequences] = useKeyStorage<SequenceState>(
    "sequence",
    {}
  );

  // 스웨거 타이틀에 해당하는 시퀀스 생성
  const createSequence = useCallback(
    async (swaggerTitle: string) => {
      await setSequences((prev) => {
        const updatedState = { ...prev };
        updatedState[swaggerTitle] = updatedState[swaggerTitle] || [];

        return updatedState;
      });
    },
    [setSequences]
  );

  // 시퀀스 추가
  const addSequence = useCallback(
    async (swaggerTitle: string, sequence: Omit<SequenceItemType, "id">) => {
      await setSequences((prev) => {
        const updatedState = { ...prev };
        const sequences = [...(updatedState[swaggerTitle] || [])];

        const lastId =
          sequences.length > 0
            ? Math.max(...sequences.map((seq) => seq.id), 0)
            : 0;

        const newSequence = { ...sequence, id: lastId + 1 };
        updatedState[swaggerTitle] = [newSequence, ...sequences];

        return updatedState;
      });
    },
    [setSequences]
  );

  // 시퀀스 삭제
  const deleteSequences = useCallback(
    async (swaggerTitle: string, sequenceIds: number[]) => {
      await setSequences((prev) => {
        const updatedState = { ...prev };
        if (!updatedState[swaggerTitle]) return updatedState;

        updatedState[swaggerTitle] = updatedState[swaggerTitle].filter(
          (sequence) => !sequenceIds.includes(sequence.id)
        );

        return updatedState;
      });
    },
    [setSequences]
  );

  // 시퀀스 목록 업데이트
  const updateSequences = useCallback(
    async (swaggerTitle: string, sequences: SequenceItemType[]) => {
      await setSequences((prev) => {
        const updatedState = { ...prev };
        updatedState[swaggerTitle] = [...sequences];
        return updatedState;
      });
    },
    [setSequences]
  );

  // API 추가
  const addAPI = useCallback(
    async (swaggerTitle: string, sequenceId: number, api: APIWithKey) => {
      await setSequences((prev) => {
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
    },
    [setSequences]
  );

  // API 목록 업데이트
  const updateAPI = useCallback(
    async (swaggerTitle: string, sequenceId: number, apis: APIWithOrder[]) => {
      await setSequences((prev) => {
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
    },
    [setSequences]
  );

  // API 삭제
  const deleteAPIs = useCallback(
    async (swaggerTitle: string, sequenceId: number, keys: string[]) => {
      await setSequences((prev) => {
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
    },
    [setSequences]
  );

  // 폼 값 업데이트
  const updateFormValues = useCallback(
    async (
      swaggerTitle: string,
      sequenceId: number,
      key: string,
      formValues: FormValues
    ) => {
      await setSequences((prev) => {
        const updatedState = { ...prev };
        if (!updatedState[swaggerTitle]) return updatedState;

        const sequenceIndex = updatedState[swaggerTitle].findIndex(
          (s) => s.id === sequenceId
        );

        if (sequenceIndex === -1) return updatedState;

        // 불변성을 유지하며 시퀀스 배열 및 객체 복사
        updatedState[swaggerTitle] = [...updatedState[swaggerTitle]];
        const sequence = {
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
    },
    [setSequences]
  );

  interface UpdateResponseProps {
    swaggerTitle: string;
    sequenceId: number;
    key: string;
    response: unknown;
    request: unknown;
  }

  // 응답 업데이트
  const updateResponse = useCallback(
    async ({
      swaggerTitle,
      sequenceId,
      key,
      response,
      request,
    }: UpdateResponseProps) => {
      await setSequences((prev) => {
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
          api.key === key
            ? { ...api, response, request, iconType: "SUCCESS" }
            : api
        );

        // 업데이트된 시퀀스로 교체
        updatedState[swaggerTitle][sequenceIndex] = sequence;

        return updatedState;
      });
    },
    [setSequences]
  );

  // 스웨거 타이틀에 해당하는 시퀀스 목록 가져오기
  const getSequencesByTitle = useCallback(
    (swaggerTitle: string): SequenceItemType[] => {
      // 직렬화를 통해 일반 객체 반환하여 Proxy 문제 방지
      if (!sequences[swaggerTitle]) return [];
      return JSON.parse(JSON.stringify(sequences[swaggerTitle]));
    },
    [sequences]
  );

  // 시퀀스 ID로 특정 시퀀스 가져오기
  const getSequenceById = useCallback(
    (swaggerTitle: string, sequenceId: number): SequenceItemType | null => {
      try {
        if (!sequences[swaggerTitle]) return null;

        // 직렬화를 통해 일반 객체 반환하여 Proxy 문제 방지
        const sequenceList = JSON.parse(
          JSON.stringify(sequences[swaggerTitle])
        ) as SequenceItemType[];
        const result =
          sequenceList.find((seq) => seq.id === sequenceId) || null;

        return result;
      } catch (error) {
        return null;
      }
    },
    [sequences]
  );

  const getSequenceByTitle = (swaggerTitle: string): SequenceItemType[] => {
    return sequences[swaggerTitle] || [];
  };

  const getSequences = (): SequenceState => {
    return sequences;
  };

  return {
    sequences,
    createSequence,
    addSequence,
    deleteSequences,
    updateSequences,
    addAPI,
    updateAPI,
    deleteAPIs,
    updateFormValues,
    updateResponse,
    getSequencesByTitle,
    getSequenceById,
    getSequenceByTitle,
    getSequences,
  };
}
