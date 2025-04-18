import { API } from "@/entities/docs/model/types/docs";
import { FormValues } from "@/features/request-api/module/hooks/useForm";

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
