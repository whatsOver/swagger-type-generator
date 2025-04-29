import { APIWithOrder } from "@/entities/sequence/types/sequence";
import { useApiAddForm } from "@/features/api-generate/module/hooks/useApiAddForm";
import { ApiAdd } from "@/features/api-generate/ui/ApiAdd/ApiAdd";
import { MetaData } from "@/features/api-generate/ui/MetaData/MetaData";
import { extractNonEmptyArrayKeys } from "@/shared/hooks/funnel/models";
import { useFunnel } from "@/shared/hooks/funnel/useFunnel";
import { navigationPath } from "@/shared/hooks/useRouter";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DocsApiListPage } from "./pages/DocsApiListPage";
import { DocsApiSearchPage } from "./pages/DocsApiSearchPage/DocsApiSearchPage";
import { DocsDeleteApiPage } from "./pages/DocsDeleteApiPage/DocsDeleteApiPage";

export interface DocsApiListFunnelProps {
  id: string;
  onNext: () => void;
}

interface ApiAddFunnelParams extends Record<string, string> {
  id: string;
}

export const DocsApiListFunnel = () => {
  const { id: docId } = useParams<ApiAddFunnelParams>();

  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.API_문서_리스트_퍼널(docId))
  );

  const form = useApiAddForm();

  const [apis, setAPIs] = useState<APIWithOrder[]>([]);

  return (
    <Funnel>
      <Funnel.Step name="API_문서_리스트_페이지">
        <DocsApiListPage
          id={docId}
          onNext={() => setStep("API_데이터_입력_페이지")}
          onClickAdd={() => setStep("META_데이터_입력_페이지")}
          onClickChangeOrder={() => setStep("API_데이터_입력_페이지")}
          onClickDelete={() => setStep("API_문서_삭제_페이지")}
          onClickBringFromDocs={() => setStep("API_문서_검색_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="API_문서_검색_페이지">
        <DocsApiSearchPage
          id={docId}
          apis={apis}
          onNext={() => setStep("API_문서_리스트_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="API_문서_삭제_페이지">
        <DocsDeleteApiPage
          id={docId}
          onNext={() => setStep("API_문서_리스트_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="META_데이터_입력_페이지">
        <MetaData
          id={docId}
          form={form}
          onNext={() => setStep("API_데이터_입력_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="API_데이터_입력_페이지">
        <ApiAdd
          id={docId}
          form={form}
          onNext={() => setStep("API_문서_리스트_페이지")}
        />
      </Funnel.Step>
    </Funnel>
  );
};
