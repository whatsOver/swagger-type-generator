import { useSequenceStore } from "@/entities/sequence/hooks/useSequenceStore";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import useRouter from "@/shared/hooks/useRouter";
import { useState } from "react";
import { toast } from "react-toastify";

type Mode = "VIEW" | "ADD";

type OmitOnNext = Omit<SequenceFunnelProps, "onNext" | "sequenceList">;
type HandleSequencePageProps = OmitOnNext;

export const useHandleSequencePage = ({
  swaggerTitle,
}: HandleSequencePageProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("VIEW");
  const { addSequence } = useSequenceStore();

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
    if (!title) {
      toast.error("Title is required");
      return;
    }
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
