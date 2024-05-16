import useRouter from "@src/pages/popup/hooks/useRouter";
import { SequenceFunnelProps } from "@src/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import { useState } from "react";
import { addSequence } from "../../store/sequence";

type Mode = "VIEW" | "ADD";

type OmitOnNext = Omit<SequenceFunnelProps, "onNext" | "sequenceList">;
type HandleSequencePageProps = OmitOnNext;

const useHandleSequencePage = ({ swaggerTitle }: HandleSequencePageProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("VIEW");

  const onClickAdd = () => {
    setMode("ADD");
  };

  const onClickClose = () => {
    setMode("VIEW");
  };

  // USER INTERACTION
  const [addTitle, setAddTitle] = useState<string>("");

  const onChangeTitle = (title: string) => {
    setAddTitle(title);
  };

  const onPressEnter = (title: string) => {
    addSequence(swaggerTitle, { title, iconType: "LOADING", apiList: [] });
    setMode("VIEW");
    setAddTitle("");
  };

  const onClickSequence = (id: number, title: string) => {
    router.push(`/sequence/${id}`, { swaggerTitle, title });
  };

  return {
    modeSate: {
      mode,
      onClickAdd,
      onClickClose,
    },
    addTitle,
    onChangeTitle,
    onPressEnter,
    onClickSequence,
  };
};

export default useHandleSequencePage;
