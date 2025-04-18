import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { DocItem } from "@/entities/docs/model/types/docs";
import { extractNonEmptyArrayKeys } from "@/shared/hooks/funnel/models";
import { useFunnel } from "@/shared/hooks/funnel/useFunnel";
import { navigationPath } from "@/shared/hooks/useRouter";
import { useEffect, useState } from "react";
import { DeleteDocsPage } from "./pages/DeleteDocs/DeleteDocs";
import { DocsPage } from "./pages/Docs/DocsPage";
import { ReorderDocsPage } from "./pages/ReorderDocs/ReorderDocsPage";

export interface DocsFunnelProps {
  docsList: DocItem[];
  setDocsList: (docsList: DocItem[]) => void;
  onNext: () => void;
}

export const DocsFunnel = () => {
  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.API_문서_퍼널())
  );

  const { docsState } = useDocsStore();

  const [docsList, setDocsList] = useState<DocItem[]>(docsState.docsList);

  useEffect(() => {
    setDocsList(docsState.docsList);
  }, [docsState.docsList]);

  return (
    <Funnel>
      <Funnel.Step name="API_문서_페이지">
        <DocsPage setStep={setStep} />
      </Funnel.Step>
      <Funnel.Step name="API_문서_순서_편집_페이지">
        <ReorderDocsPage
          docsList={docsList}
          setDocsList={setDocsList}
          onNext={() => setStep("API_문서_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="API_문서_삭제_페이지">
        <DeleteDocsPage
          docsList={docsList}
          setDocsList={setDocsList}
          onNext={() => setStep("API_문서_페이지")}
        />
      </Funnel.Step>
    </Funnel>
  );
};
