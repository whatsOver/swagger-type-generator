import useRouter, {
  API_관리_퍼널_Key,
  navigationPath,
} from "@/pages/popup/hooks/useRouter";
import { popupStyle } from "@/pages/popup/pages/Popup/popup.css";
import { ScenarioFunnelProps } from "@/pages/popup/pages/ScenarioFunnel/ScenarioFunnel";
import BlankItem from "@/pages/popup/ui/error/BlankItem";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Header from "@/shared/ui/Header";
import ScenarioItem from "../../ui/ScenarioItem/ScenarioItem";

type OmitOnNext = Omit<ScenarioFunnelProps, "onNext" | "setAPIs">;

type ScenarioProps = OmitOnNext & {
  title: string;
  setStep: (step: API_관리_퍼널_Key) => void;
};

const Scenario = ({
  apis,
  sequenceId,
  title,
  swaggerTitle,
  setStep,
}: ScenarioProps) => {
  const router = useRouter();

  const onClickAdd = () => {
    setStep("API_추가_페이지");
  };

  const onClickAPI = (apiId: number) => {
    router.push(
      navigationPath.다수_API_테스트_페이지(sequenceId)(String(apiId)),
      {
        swaggerTitle,
      }
    );
  };

  const onClickRun = () => {
    router.push(navigationPath.다수_API_테스트_페이지(sequenceId)(String(0)), {
      swaggerTitle,
    });
  };

  return (
    <div id="main" className={popupStyle.app}>
      <Header
        headerTitle={title}
        backTo={navigationPath.시나리오_관리_퍼널().시나리오_페이지}
        showBackButton
        rightButton={
          <>
            <Dropdown>
              <Dropdown.Trigger as={<Button color="purple">Edit</Button>} />
              <Dropdown.Modal>
                <Dropdown.Item onClick={() => setStep("API_추가_페이지")}>
                  Add New API
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStep("순서_편집_페이지")}>
                  Change Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStep("삭제_페이지")}>
                  Delete APIs
                </Dropdown.Item>
              </Dropdown.Modal>
            </Dropdown>
            <Button onClick={onClickRun} color="purpleLarge">
              RUN
            </Button>
          </>
        }
      />

      <>
        {!apis.length && (
          <BlankItem>
            <p>There are no scenario.</p>
            <Button onClick={onClickAdd} color="purpleLarge">
              ADD
            </Button>
          </BlankItem>
        )}
        {!!apis.length &&
          apis.map((api, idx) => (
            <ScenarioItem
              key={api.key}
              api={api}
              onClick={() => onClickAPI(idx)}
            />
          ))}
      </>
    </div>
  );
};

export default Scenario;
