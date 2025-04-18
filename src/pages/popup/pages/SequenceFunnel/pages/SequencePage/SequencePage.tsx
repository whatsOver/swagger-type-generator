import SequenceAddItem from "@/features/add-sequence/ui/SequenceAddItem/SequenceAddItem";
import { apiListStyle } from "@/pages/popup/pages/ApiListPage/ui/apiList.css";
import { SequenceFunnelProps } from "@/pages/popup/pages/SequenceFunnel/SequenceFunnel";
import useDrawer from "@/shared/hooks/useDrawer";
import { 시나리오_관리_퍼널_Key } from "@/shared/hooks/useRouter";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Header from "@/shared/ui/Header";
import BlankItem from "@/shared/ui/blank-item/BlankItem";
import { vars } from "@/shared/ui/styles/theme.css";
import { SequenceList } from "@/widgets/sequence-list/ui/list/SequenceList";
import SettingDrawer from "@/widgets/setting/ui/setting-drawer/SettingDrawer";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { Flip, ToastContainer } from "react-toastify";
import { useHandleSequencePage } from "./module/hooks/useHandleSequencePage";
import { sequenceStyles } from "./sequence.css";

type OmitOnNext = Omit<SequenceFunnelProps, "onNext">;
interface SequencePageProps extends OmitOnNext {
  setStep: (step: 시나리오_관리_퍼널_Key) => void;
}

export const SequencePage = ({
  sequenceList,
  swaggerTitle,
  setStep,
}: SequencePageProps) => {
  const { open, openDrawer, closeDrawer } = useDrawer();
  const { modeSate, addTitle, onChangeTitle, onClickSequence, onPressEnter } =
    useHandleSequencePage({ swaggerTitle });

  return (
    <div id="main" className={apiListStyle.app}>
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
                  Delete
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
        <SequenceList sequenceList={sequenceList} onClick={onClickSequence} />
      </div>
      <SettingDrawer isOpen={open} onClose={closeDrawer} />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        theme="dark"
        transition={Flip}
      />
    </div>
  );
};
