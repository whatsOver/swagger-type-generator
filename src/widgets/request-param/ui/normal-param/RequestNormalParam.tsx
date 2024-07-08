import { Parameters } from "@/entities/swagger/types";
import { FormValues } from "@/features/request-api/module/hooks/useForm";
import Input from "@/shared/ui/Input";
import { typeConverter } from "@/shared/util/typeConverter";
import { requestNormalParamStyles } from "./requestNormalParam.css";

interface NormalParamProps {
  param: Parameters;
  formValues: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  idx: number;
}

export const RequestNormalParam = ({
  param,
  formValues,
  handleChange,
  idx,
}: NormalParamProps) => {
  return (
    <>
      <div className={requestNormalParamStyles.inputWrapper} key={param.name}>
        <div className={requestNormalParamStyles.inputBox} key={param.name}>
          <label className={requestNormalParamStyles.label}>{param.name}</label>
          <label className={requestNormalParamStyles.type}>
            {typeConverter(param.schema?.type)}
          </label>
          <Input
            style={{ width: "40%", textAlign: "right" }}
            type={param.schema?.type ?? "string"}
            name={param.name}
            value={formValues[param.name] as string}
            placeholder={param?.example !== undefined ? param.example + "" : ""}
            required={param.required}
            onChange={handleChange}
            defaultValue={
              param.required ? param.example ?? "" : param.schema?.default ?? ""
            }
            autoFocus={idx === 0}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </>
  );
};
