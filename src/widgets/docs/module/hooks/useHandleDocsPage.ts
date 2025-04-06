import { addSequence } from "@/entities/sequence/model/sequence-store";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import useRouter from "@/shared/hooks/useRouter";
import { useState } from "react";
import { toast } from "react-toastify";

type Mode = "VIEW" | "ADD";

type OmitOnNext = Omit<SequenceFunnelProps, "onNext" | "sequenceList">;
type HandleSequencePageProps = OmitOnNext;

interface Docs {
  title: string;
  description: string;
}

export const useHandleDocsPage = ({
  swaggerTitle,
}: HandleSequencePageProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("VIEW");

  const onClickAdd = () => {
    setMode("ADD");
  };

  const onClickClose = () => {
    setMode("VIEW");
  };

  // USER INTERACTION
  const [docs, setDocs] = useState<Docs>({
    title: "",
    description: "",
  });

  const onChangeTitle = (title: string) => {
    setDocs((prev) => ({ ...prev, title }));
  };

  const onChangeDescription = (description: string) => {
    setDocs((prev) => ({ ...prev, description }));
  };

  const onPressEnter = (title: string, description: string) => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    addSequence(swaggerTitle, { title, iconType: "LOADING", apiList: [] });
    setMode("VIEW");
    setDocs({ title, description });
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
    onPressEnter,
    onClickSequence,
  };
};
