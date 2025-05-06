import { DocsAddItem } from "@/features/add-docs/ui/DocsAddItem";
import { apiListStyle } from "@/pages/popup/pages/ApiListPage/ui/apiList.css";
import useDrawer from "@/shared/hooks/useDrawer";
import { API_문서_페이지_Key } from "@/shared/hooks/useRouter";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Header from "@/shared/ui/Header";
import BlankItem from "@/shared/ui/blank-item/BlankItem";
import { vars } from "@/shared/ui/styles/theme.css";
import DocsList from "@/widgets/docs-list/ui/list/DocsList";
import SettingDrawer from "@/widgets/setting/ui/setting-drawer/SettingDrawer";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { Flip, ToastContainer } from "react-toastify";
import { docsPageStyles } from "./docsPage.css";
import { useHandleDocsPage } from "./module/hooks/useHandleDocsPage";

type DocsPageProps = {
  setStep: (step: API_문서_페이지_Key) => void;
};

export const DocsPage = ({ setStep }: DocsPageProps) => {
  const { open, openDrawer, closeDrawer } = useDrawer();
  const {
    mode,
    docsState,
    doc,
    onChangeTitle,
    onChangeDescription,
    onChangeColor,
    onClickAdd,
    onClickCloseAdd,
    onPressEnter,
    onClickDocItem,
  } = useHandleDocsPage();

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        headerTitle="My Docs"
        leftButton={
          <button className={apiListStyle.headerButton} onClick={openDrawer}>
            <MenuIcon size={24} color={vars.color.white} />
          </button>
        }
        rightButton={
          <>
            <Dropdown>
              <Dropdown.Trigger as={<Button color="purple">Edit</Button>} />
              <Dropdown.Modal>
                <Dropdown.Item
                  onClick={() => setStep("API_문서_순서_편집_페이지")}
                >
                  Change Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStep("API_문서_삭제_페이지")}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Modal>
            </Dropdown>
            <Button onClick={onClickAdd} color="purpleLarge">
              ADD
            </Button>
          </>
        }
      />
      <div className={docsPageStyles.docsWrapper}>
        {/** Document Add Form */}
        {mode === "ADD" && (
          <DocsAddItem
            title={doc.title}
            description={doc.description}
            color={doc.color}
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
            onChangeColor={onChangeColor}
            onPressEnter={onPressEnter}
            onClickClose={onClickCloseAdd}
          />
        )}

        {/** Document List or Blank State */}
        {mode === "VIEW" && docsState.docsList.length > 0 && (
          <DocsList
            docsList={docsState.docsList}
            onItemClick={onClickDocItem}
          />
        )}
        {mode === "VIEW" && docsState.docsList.length === 0 && (
          <div className={docsPageStyles.blankItemWrapper}>
            <BlankItem>
              <p>There are no documents.</p>
              <Button onClick={onClickAdd} color="purpleLarge">
                ADD
              </Button>
            </BlankItem>
          </div>
        )}
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
