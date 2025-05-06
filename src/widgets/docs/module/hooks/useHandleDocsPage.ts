import { DEFAULT_DOC_ITEM } from "@/entities/docs/model/data/docs";
import { DocItem } from "@/entities/docs/model/types/docs";
import { useSequenceStore } from "@/entities/sequence/hooks/useSequenceStore";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import useRouter from "@/shared/hooks/useRouter";
import { useState } from "react";
import { toast } from "react-toastify";

type Mode = "VIEW" | "ADD";

type OmitOnNext = Omit<SequenceFunnelProps, "onNext" | "sequenceList">;
type HandleSequencePageProps = OmitOnNext;

export const useHandleDocsPage = ({
  swaggerTitle,
}: HandleSequencePageProps) => {
  const router = useRouter();

  const { addSequence } = useSequenceStore();

  const [mode, setMode] = useState<Mode>("VIEW");

  const onClickAdd = () => {
    setMode("ADD");
  };

  const onClickClose = () => {
    setMode("VIEW");
  };

  // USER INTERACTION
  const [docs, setDocs] = useState<DocItem>(DEFAULT_DOC_ITEM);

  const onChangeTitle = (title: string) => {
    setDocs((prev) => ({ ...prev, title }));
  };

  const onChangeDescription = (description: string) => {
    setDocs((prev) => ({ ...prev, description }));
  };

  const onChangeColor = (color: string) => {
    setDocs((prev) => ({ ...prev, color }));
  };

  const onPressEnter = (title: string, description: string) => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    addSequence(swaggerTitle, { title, iconType: "LOADING", apiList: [] });
    setMode("VIEW");
    setDocs(DEFAULT_DOC_ITEM);
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
    docs,
    onChangeTitle,
    onChangeDescription,
    onChangeColor,
    onPressEnter,
    onClickSequence,
  };
};
