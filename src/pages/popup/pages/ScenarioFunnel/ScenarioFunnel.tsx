import { useSequence } from "@/entities/sequence/hooks/useSequence";
import { APIWithOrder } from "@/entities/sequence/model/sequence-store";
import { extractNonEmptyArrayKeys } from "@/shared/hooks/funnel/models";
import { useFunnel } from "@/shared/hooks/funnel/useFunnel";
import { navigationPath } from "@/shared/hooks/useRouter";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import APISearchPage from "../APISearch/APISearchPage";
import DeleteAPIPage from "../Delete/DeleteApiPage2";
import ReorderApiPage from "../Reorder/ReorderApiPage";
import Scenario from "../Scenario/Scenario";

export interface ScenarioFunnelProps {
  apis: APIWithOrder[];
  sequenceId: string;
  swaggerTitle: string;
  onNext: (apis: APIWithOrder[]) => void;
}

// NOTE : 시나리오 페이지
// 사용자의 시나리오를 정의하고 시나리오에 맞는
// API를 추가하고 순서를 편집하고 삭제할 수 있는 페이지

const ScenarioFunnel = () => {
  const { id: sequenceId } = useParams<{ id: string }>();
  const locationState = useLocation().state as {
    swaggerTitle: string;
  };

  const [swaggerTitle, setSwaggerTitle] = useState<string>("");
  const [scenarioTitle, setScenarioTitle] = useState<string>("");
  const [apis, setAPIs] = useState<APIWithOrder[]>([]);

  // useSequence 훅 사용
  const { sequences, getSequenceById } = useSequence();

  useEffect(() => {
    if (!locationState) return;
    if (!locationState.swaggerTitle) return;
    setSwaggerTitle(locationState.swaggerTitle);
  }, [locationState]);

  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.API_관리_퍼널(sequenceId))
  );

  // 시퀀스 및 API 데이터 로드
  useEffect(() => {
    if (!swaggerTitle) return;

    // 초기 데이터 로드 - useSequence 사용
    const sequenceData = getSequenceById(swaggerTitle, Number(sequenceId));

    if (sequenceData) {
      setScenarioTitle(sequenceData.title);
      setAPIs(sequenceData.apiList);
    }
  }, [swaggerTitle, sequenceId, sequences]);

  return (
    <Funnel>
      <Funnel.Step name="시나리오_페이지">
        <Scenario
          sequenceId={sequenceId}
          apis={apis}
          title={scenarioTitle}
          setStep={setStep}
          swaggerTitle={swaggerTitle}
        />
      </Funnel.Step>
      <Funnel.Step name="API_추가_페이지">
        <APISearchPage
          apis={apis}
          sequenceId={sequenceId}
          swaggerTitle={swaggerTitle}
          onNext={(apis) => {
            setAPIs(apis);
            setStep("순서_편집_페이지");
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="순서_편집_페이지">
        <ReorderApiPage
          apis={apis}
          sequenceId={sequenceId}
          onChange={setAPIs}
          swaggerTitle={swaggerTitle}
          onNext={(apis) => {
            setAPIs(apis);
            setStep("시나리오_페이지");
          }}
        />
      </Funnel.Step>
      <Funnel.Step name="삭제_페이지">
        <DeleteAPIPage
          apis={apis}
          sequenceId={sequenceId}
          swaggerTitle={swaggerTitle}
          onNext={(apis) => {
            setAPIs(apis);
            setStep("시나리오_페이지");
          }}
        />
      </Funnel.Step>
    </Funnel>
  );
};

export default ScenarioFunnel;
