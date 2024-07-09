import {
  APIWithOrder,
  sequenceStorage,
} from "@/entities/sequence/model/sequence-store";
import { extractNonEmptyArrayKeys } from "@/shared/hooks/funnel/models";
import { useFunnel } from "@/shared/hooks/funnel/useFunnel";
import { navigationPath } from "@/shared/hooks/useRouter";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import APISearchPage from "../APISearch/APISearchPage";
import DeleteAPIPage from "../Delete/DeleteApiage";
import ReorderApiPage from "../Reorder/ReorderApiPage";
import Scenario from "../Scenario/Scenario";

export interface ScenarioFunnelProps {
  apis: APIWithOrder[];
  sequenceId: string;
  swaggerTitle: string;
  setAPIs: Dispatch<SetStateAction<APIWithOrder[]>>;
  onNext: () => void;
}

const ScenarioFunnel = () => {
  const { id: sequenceId } = useParams<{ id: string }>();
  const locationState = useLocation().state as {
    swaggerTitle: string;
  };

  const [swaggerTitle, setSwaggerTitle] = useState<string>("");
  const [scenarioTitle, setScenarioTitle] = useState<string>("");

  useEffect(() => {
    if (!locationState) return;
    if (!locationState.swaggerTitle) return;
    setSwaggerTitle(locationState.swaggerTitle);
  }, [locationState]);

  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.API_관리_퍼널(sequenceId))
  );
  // 1. 크롬 스토리지에서 구독해서 가져오고
  // 2. 구독한 데이터를 가지고 시나리오 페이지를 렌더링한다.
  const [apis, setAPIs] = useState<APIWithOrder[]>([]);

  useEffect(() => {
    if (!swaggerTitle) return;
    sequenceStorage.subscribe((sequence) => {
      const findSequence = sequence[swaggerTitle].find(
        (item) => item.id === Number(sequenceId)
      );
      setScenarioTitle(findSequence.title);
      if (findSequence) setAPIs(findSequence.apiList);
    });
  }, [swaggerTitle]);

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
          setAPIs={setAPIs}
          swaggerTitle={swaggerTitle}
          onNext={() => setStep("순서_편집_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="순서_편집_페이지">
        <ReorderApiPage
          apis={apis}
          sequenceId={sequenceId}
          setAPIs={setAPIs}
          swaggerTitle={swaggerTitle}
          onNext={() => setStep("시나리오_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="삭제_페이지">
        <DeleteAPIPage
          apis={apis}
          sequenceId={sequenceId}
          setAPIs={setAPIs}
          swaggerTitle={swaggerTitle}
          onNext={() => setStep("시나리오_페이지")}
        />
      </Funnel.Step>
    </Funnel>
  );
};

export default ScenarioFunnel;
