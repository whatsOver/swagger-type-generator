import { extractNonEmptyArrayKeys } from "@src/common/hooks/funnel/models";
import { useFunnel } from "@src/common/hooks/funnel/useFunnel";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteSequencePage from "../../Sequence/pages/Delete/DeleteSequencePage";
import ReorderSequencePage from "../../Sequence/pages/Reorder/ReorderSequencePage";
import SequencePage from "../../Sequence/pages/Sequence/SequencePage";
import {
  SequenceItem,
  createSequence,
  sequenceStorage,
} from "../../Sequence/store/sequence";
import useHandlePopup from "../../hooks/Popup/useHandlePopup";
import { navigationPath } from "../../hooks/useRouter";

export interface SequenceFunnelProps {
  swaggerTitle: string;
  sequenceList: SequenceItem[];
  setSequenceList?: Dispatch<SetStateAction<SequenceItem[]>>;
  onNext: () => void;
}

const SequenceFunnel = () => {
  const [Funnel, setStep] = useFunnel(
    extractNonEmptyArrayKeys(navigationPath.시나리오_관리_퍼널())
  );

  const { apiDocsData } = useHandlePopup();

  const [sequenceList, setSequenceList] = useState<SequenceItem[]>([]);
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
          setSequenceList={setSequenceList}
          swaggerTitle={swaggerTitle}
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
