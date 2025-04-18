import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { API, ApiListType } from "@/entities/docs/model/types/docs";
import { transformApiFromSwagger } from "@/features/api-generate/module/utils/apiTransform";
import useHandleAuth from "@/features/auth/hooks/useHandleAuth";
import AuthModal from "@/features/auth/ui/auth-modal/AuthModal";
import { extractTagsAndEndpoints } from "@/features/extract-api/module/utils/extract-api";
import useSearch from "@/features/search-api/module/hooks/useSearch";
import useHandleSetting from "@/features/setting/module/hooks/useHandleSetting";
import useDrawer from "@/shared/hooks/useDrawer";
import useRouter from "@/shared/hooks/useRouter";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Header from "@/shared/ui/Header";
import Search from "@/shared/ui/search/Search";
import { vars } from "@/shared/ui/styles/theme.css";
import BlankApi from "@/widgets/api-list/ui/blank/BlankApi";
import { ApiList } from "@/widgets/api-list/ui/normal-list/ApiList";
import SettingDrawer from "@/widgets/setting/ui/setting-drawer/SettingDrawer";
import SettingModal from "@/widgets/setting/ui/setting-modal/SettingModal";
import { useEffect, useState } from "react";
import { FiMenu as MenuIcon } from "react-icons/fi";
import { apiListStyle } from "../../ApiList/ui/apiList.css";
import { DocsApiListFunnelProps } from "../DocsApiListFunnel";

type DocsApiListPageProps = DocsApiListFunnelProps & {
  onClickAdd: () => void;
  onClickChangeOrder: () => void;
  onClickDelete: () => void;
};

export const DocsApiListPage = ({
  id,
  onClickAdd,
  onClickChangeOrder,
  onClickDelete,
}: DocsApiListPageProps) => {
  const { push } = useRouter();
  const { docsState } = useDocsStore();

  const [apiList, setApiList] = useState<ApiListType>({
    tags: [],
    endpoints: {},
  });

  const [filteredApiList, setFilteredApiList] = useState<ApiListType>({
    tags: [],
    endpoints: {},
  });

  useEffect(() => {
    setApiList(
      extractTagsAndEndpoints(
        docsState.docsList.find((doc) => doc.id === id)?.swaggerDocs
      )
    );
  }, [docsState.docsList, id]);

  const { authorized, onChangeAuth, onSaveAuth } = useHandleAuth();

  const { search, onChange } = useSearch({ apiList, setFilteredApiList });

  const { withReactQuery, toggleReactQuery, onSaveSetting } =
    useHandleSetting();

  const { open, openDrawer, closeDrawer } = useDrawer();

  const onClickAPI = (api: API) => {
    const swaggerDocs = docsState.docsList.find(
      (doc) => doc.id === id
    )?.swaggerDocs;

    push("/request", {
      ...transformApiFromSwagger(swaggerDocs, api),
      host: api.path,
    });
  };

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        headerTitle="My Documents"
        leftButton={
          <button className={apiListStyle.headerButton} onClick={openDrawer}>
            <MenuIcon size={24} color={vars.color.white} />
          </button>
        }
        rightButton={
          <div className={apiListStyle.settingButtonWrapper}>
            <Dropdown>
              <Dropdown.Trigger as={<Button color="purple">Edit</Button>} />
              <Dropdown.Modal>
                <Dropdown.Item onClick={onClickChangeOrder}>
                  Change Order
                </Dropdown.Item>
                <Dropdown.Item onClick={onClickDelete}>
                  Delete Sequence
                </Dropdown.Item>
              </Dropdown.Modal>
            </Dropdown>
            <Button onClick={onClickAdd} color="purpleLarge">
              ADD
            </Button>
            <SettingModal
              withReactQuery={withReactQuery}
              toggleReactQuery={toggleReactQuery}
              onSaveSetting={onSaveSetting}
            />
            <AuthModal
              authorized={authorized}
              onChange={onChangeAuth}
              onSaveAuth={onSaveAuth}
            />
          </div>
        }
      />

      <div className={apiListStyle.searchWrapper}>
        <Search value={search} onChange={onChange} />
      </div>

      {!!filteredApiList.tags?.length && (
        <ApiList apiList={filteredApiList} onClickAPI={onClickAPI} />
      )}
      {!filteredApiList.tags?.length && <BlankApi />}
      <SettingDrawer isOpen={open} onClose={closeDrawer} />
    </div>
  );
};
