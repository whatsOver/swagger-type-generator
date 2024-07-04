import { popupStyle } from "@/pages/popup/pages/Popup/popup.css";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import BlankItem from "@/pages/popup/ui/error/BlankItem";
import useDrawer from "@/shared/hooks/useDrawer";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Header from "@/shared/ui/Header";
import { vars } from "@/shared/ui/styles/theme.css";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { 시나리오_관리_퍼널_Key } from "../../../../../shared/hooks/useRouter";
import SettingDrawer from "../../../ui/SettingDrawer";
import useHandleSequencePage from "../../module/sequence/useHandleSequencePage";
import SequenceAddItem from "../../ui/SequenceAddItem/SequenceAddItem";
import SequenceItem from "../../ui/SequenceItem/SequenceItemWithStatus";
import { sequenceStyles } from "./sequence.css";

type OmitOnNext = Omit<SequenceFunnelProps, "onNext">;
interface SequencePageProps extends OmitOnNext {
  setStep: (step: 시나리오_관리_퍼널_Key) => void;
}

const SequencePage = ({
  sequenceList,
  swaggerTitle,
  setStep,
}: SequencePageProps) => {
  const { open, openDrawer, closeDrawer } = useDrawer();
  const { modeSate, addTitle, onChangeTitle, onClickSequence, onPressEnter } =
    useHandleSequencePage({ swaggerTitle });

  return (
    <div id="main" className={popupStyle.app}>
      <Header
        headerTitle=""
        leftButton={
          <button onClick={openDrawer}>
            <MenuIcon size={24} color={vars.color.white} />
          </button>
        }
        rightButton={
          <>
            <Dropdown>
              <Dropdown.Trigger as={<Button color="purple">Edit</Button>} />
              <Dropdown.Modal>
                <Dropdown.Item onClick={() => setStep("순서_편집_페이지")}>
                  Change Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStep("삭제_페이지")}>
                  Delete Sequence
                </Dropdown.Item>
              </Dropdown.Modal>
            </Dropdown>
            <Button onClick={modeSate.onClickAdd} color="purpleLarge">
              ADD
            </Button>
          </>
        }
      />
      <div className={sequenceStyles.sequenceWrapper}>
        {/** API 추가시 입력 */}
        {modeSate.mode === "ADD" && (
          <SequenceAddItem
            title={addTitle}
            onChangeTitle={onChangeTitle}
            onPressEnter={() => onPressEnter(addTitle)}
            onClickClose={modeSate.onClickClose}
          />
        )}
        {/** API 리스트 */}
        {!sequenceList?.length && (
          <BlankItem>
            <p>There are no sequences.</p>
            <Button onClick={modeSate.onClickAdd} color="purpleLarge">
              ADD
            </Button>
          </BlankItem>
        )}
        {sequenceList?.map((item) => (
          <SequenceItem
            {...item}
            onClick={() => onClickSequence(item.id, item.title)}
            key={item.title}
          />
        ))}
      </div>
      <SettingDrawer isOpen={open} onClose={closeDrawer} />
    </div>
  );
};

export default SequencePage;
