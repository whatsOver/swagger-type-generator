import { SequenceItemType } from "@/entities/sequence/model/sequence-store";
import { SequenceItem } from "../item/SequenceItem";

interface SequenceListProps {
  sequenceList: SequenceItemType[];
  onClick: (id: number, title: string) => void;
}

const SequenceList = ({ sequenceList, onClick }: SequenceListProps) => {
  return (
    <>
      {sequenceList.map((sequence) => (
        <SequenceItem
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

export default SequenceList;
