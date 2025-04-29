/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const useRouter = () => {
  const navigate = useNavigate();
  return useMemo(() => {
    return {
      back(steps = 1) {
        navigate(-steps);
      },
      push(path: RoutePath, state?: any) {
        navigate(
          {
            pathname: path,
          },
          {
            state,
          }
        );
      },
    };
  }, [navigate]);
};

export default useRouter;

const 메인_페이지 = `/`;
const 요청_페이지 = `/request`;
const 시퀀스_페이지 = `/sequence`;
const 시나리오_페이지 = (id: string) => `/sequence/${id}`;
const API_생성_페이지 = "/api-add";

export type 시나리오_관리_퍼널_Key =
  | "시나리오_페이지"
  | "순서_편집_페이지"
  | "삭제_페이지";

const 시나리오_관리_퍼널 = (): Record<시나리오_관리_퍼널_Key, string> => {
  return {
    시나리오_페이지: 시퀀스_페이지,
    순서_편집_페이지: 시퀀스_페이지 + "/edit",
    삭제_페이지: 시퀀스_페이지 + "/delete",
  };
};

export type API_관리_퍼널_Key =
  | "시나리오_페이지"
  | "API_추가_페이지"
  | "순서_편집_페이지"
  | "삭제_페이지";

const API_관리_퍼널 = (id: string): Record<API_관리_퍼널_Key, string> => {
  return {
    시나리오_페이지: 시나리오_페이지(id),
    API_추가_페이지: 시나리오_페이지(id) + "/add",
    순서_편집_페이지: 시나리오_페이지(id) + "/edit",
    삭제_페이지: 시나리오_페이지(id) + "/delete",
  };
};

const 다수_API_테스트_페이지 = (id: string) => (apiId: string) =>
  `/sequence/${id}/test/${apiId}`;

export type API_문서_페이지_Key =
  | "API_문서_페이지"
  | "API_문서_순서_편집_페이지"
  | "API_문서_삭제_페이지";

const API_문서_퍼널 = (): Record<API_문서_페이지_Key, string> => {
  return {
    API_문서_페이지: `/docs`,
    API_문서_순서_편집_페이지: `/docs/edit`,
    API_문서_삭제_페이지: `/docs/delete`,
  };
};

export type API_문서_리스트_퍼널_Key =
  | "API_문서_리스트_페이지"
  | "API_문서_검색_페이지"
  | "API_문서_삭제_페이지"
  | "META_데이터_입력_페이지"
  | "API_데이터_입력_페이지"
  | "API_테스트_페이지";

const API_문서_리스트_퍼널 = (
  id: string
): Record<API_문서_리스트_퍼널_Key, string> => {
  return {
    API_문서_리스트_페이지: `/docs/${id}`,
    API_문서_검색_페이지: `/docs/${id}/search`,
    API_문서_삭제_페이지: `/docs/${id}/delete`,
    META_데이터_입력_페이지: `/docs/${id}/meta-data`,
    API_데이터_입력_페이지: `/docs/${id}/api-data`,
    API_테스트_페이지: `/docs/${id}/test`,
  };
};

export type RoutePath =
  | typeof 메인_페이지
  | typeof 요청_페이지
  | typeof 시퀀스_페이지
  | ReturnType<typeof 시나리오_페이지>
  | ReturnType<typeof 시나리오_관리_퍼널>[시나리오_관리_퍼널_Key]
  | ReturnType<typeof API_관리_퍼널>[API_관리_퍼널_Key]
  | ReturnType<ReturnType<typeof 다수_API_테스트_페이지>>
  | ReturnType<typeof API_문서_리스트_퍼널>[API_문서_리스트_퍼널_Key]
  | ReturnType<typeof API_문서_퍼널>[API_문서_페이지_Key];

export const navigationPath = {
  메인_페이지,
  요청_페이지,
  시퀀스_페이지,
  API_생성_페이지,
  API_문서_리스트_퍼널,
  시나리오_페이지,
  시나리오_관리_퍼널,
  API_관리_퍼널,
  다수_API_테스트_페이지,
  API_문서_퍼널,
};
