import {
  SequenceItemType,
  createSequence,
  sequenceStorage,
} from "@/entities/sequence/model/sequence-store";
import { extractNonEmptyArrayKeys } from "@/shared/hooks/funnel/models";
import { useFunnel } from "@/shared/hooks/funnel/useFunnel";
import { navigationPath } from "@/shared/hooks/useRouter";
import { useHandleApiList } from "@/widgets/api-list/module/hooks/useHandleApiList";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteSequencePage from "../Delete/DeleteSequencePage";
import ReorderSequencePage from "../Reorder/ReorderSequencePage";
import SequencePage from "../Sequence/SequencePage";

export interface SequenceFunnelProps {
  swaggerTitle: string;
  sequenceList: SequenceItemType[];
  setSequenceList?: Dispatch<SetStateAction<SequenceItemType[]>>;
  onNext: () => void;
}

// NOTE : 시퀀스 페이지
// 스퀀스 : 사용자의 API 목록을 담을 수 있는 목록

const SequenceFunnel = () => {
  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.시나리오_관리_퍼널())
  );

  const { apiDocsData } = useHandleApiList();

  const [sequenceList, setSequenceList] = useState<SequenceItemType[]>([]);
  const [swaggerTitle, setSwaggerTitle] = useState<string>("");

  useEffect(() => {
    if (!swaggerTitle.length) return;
    const data = sequenceStorage.getSnapshot();
    const keys = Object.keys(data);
    if (keys.includes(swaggerTitle)) return;
    createSequence(swaggerTitle);
  }, [swaggerTitle, sequenceStorage.getSnapshot()]);

  useEffect(() => {
    if (!apiDocsData) return;
    if (!apiDocsData.info.title) return;
    const title = apiDocsData.info.title;
    setSwaggerTitle(title);
    sequenceStorage.subscribe((sequence) => {
      setSequenceList(sequence[title]);
    });
  }, [apiDocsData]);

  return (
    <Funnel>
      <Funnel.Step name="시나리오_페이지">
        <SequencePage
          setStep={setStep}
          sequenceList={sequenceList}
          swaggerTitle={swaggerTitle}
        />
      </Funnel.Step>
      <Funnel.Step name="순서_편집_페이지">
        <ReorderSequencePage
          sequenceList={sequenceList}
          swaggerTitle={swaggerTitle}
          setSequenceList={setSequenceList}
          onNext={() => setStep("시나리오_페이지")}
        />
      </Funnel.Step>
      <Funnel.Step name="삭제_페이지">
        <DeleteSequencePage
          sequenceList={sequenceList}
          swaggerTitle={swaggerTitle}
          onNext={() => setStep("시나리오_페이지")}
        />
      </Funnel.Step>
    </Funnel>
  );
};

export default SequenceFunnel;
