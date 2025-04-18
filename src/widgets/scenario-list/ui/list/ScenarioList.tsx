import { APIWithOrder } from "@/entities/sequence/types/sequence";
import ScenarioItem from "@/widgets/scenario-list/ui/item/ScenarioItem";

interface ScenarioListProps {
  scenarioList: APIWithOrder[];
  onClickAPI: (idx: number) => void;
}

export const ScenarioList = ({
  scenarioList,
  onClickAPI,
}: ScenarioListProps) => {
  return (
    <>
      {scenarioList.map((api, idx) => (
        <ScenarioItem key={api.key} api={api} onClick={() => onClickAPI(idx)} />
      ))}
    </>
  );
};
