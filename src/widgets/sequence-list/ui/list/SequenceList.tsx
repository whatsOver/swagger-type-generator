import { SequenceItemType } from "@/entities/sequence/types/sequence";
import { SequenceItemWithStatus } from "../item/SequenceItemWithStatus";

interface SequenceListProps {
  sequenceList: SequenceItemType[];
  onClick: (id: number, title: string) => void;
}

export const SequenceList = ({ sequenceList, onClick }: SequenceListProps) => {
  return (
    <>
      {sequenceList?.map((sequence) => (
        <SequenceItemWithStatus
          iconType={sequence.iconType}
          key={sequence.id}
          id={sequence.id}
          title={sequence.title}
          apiList={sequence.apiList}
          onClick={() => onClick(sequence.id, sequence.title)}
        />
      ))}
    </>
  );
};
