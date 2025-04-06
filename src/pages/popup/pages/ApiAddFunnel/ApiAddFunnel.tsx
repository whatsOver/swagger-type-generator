import { useApiAddForm } from "@/features/api-generate/module/hooks/useApiAddForm";
import ApiAdd from "@/features/api-generate/ui/ApiAdd/ApiAdd";
import { MetaData } from "@/features/api-generate/ui/MetaData/MetaData";
import { extractNonEmptyArrayKeys } from "@/shared/hooks/funnel/models";
import { useFunnel } from "@/shared/hooks/funnel/useFunnel";
import { navigationPath } from "@/shared/hooks/useRouter";

export interface ApiAddFunnelProps {
  onNext: () => void;
}

export const ApiAddFunnel = () => {
  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.API_생성_퍼널())
  );

  const form = useApiAddForm();

  return (
    <Funnel>
      <Funnel.Step name="META_데이터_입력_페이지">
        <MetaData
          form={form}
          onNext={() => setStep("API_데이터_입력_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="API_데이터_입력_페이지">
        <ApiAdd form={form} onNext={() => setStep("API_데이터_입력_페이지")} />
      </Funnel.Step>
    </Funnel>
  );
};
