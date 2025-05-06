import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { API, ApiListType } from "@/entities/docs/model/types/docs";
import { transformApiFromSwagger } from "@/features/api-generate/module/utils/apiTransform";
import useHandleAuth from "@/features/auth/hooks/useHandleAuth";
import AuthModal from "@/features/auth/ui/auth-modal/AuthModal";
import { extractTagsAndEndpoints } from "@/features/extract-api/module/utils/extract-api";
import useSearch from "@/features/search-api/module/hooks/useSearch";
import useHandleSetting from "@/features/setting/module/hooks/useHandleSetting";
import useDrawer from "@/shared/hooks/useDrawer";
import useRouter, { navigationPath } from "@/shared/hooks/useRouter";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/Dropdown";
import Header from "@/shared/ui/Header";
import Search from "@/shared/ui/search/Search";
import { useSubItem } from "@/shared/ui/SubItem/SubItem";
import BlankApi from "@/widgets/api-list/ui/blank/BlankApi";
import { ApiList } from "@/widgets/api-list/ui/normal-list/ApiList";
import SettingDrawer from "@/widgets/setting/ui/setting-drawer/SettingDrawer";
import SettingModal from "@/widgets/setting/ui/setting-modal/SettingModal";
import { useEffect, useState } from "react";
import { apiListStyle } from "../../ApiListPage/ui/apiList.css";
import { DocsApiListFunnelProps } from "../DocsApiListFunnel";

const STEPS = ["API List", "Sequence List"] as const;

type DocsApiListPageProps = DocsApiListFunnelProps & {
  onClickAdd: () => void;
  onClickDelete: () => void;
  onClickBringFromDocs: () => void;
};

export const DocsApiListPage = ({
  id,
  onClickAdd,
  onClickDelete,
  onClickBringFromDocs,
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

  const { open, closeDrawer } = useDrawer();

  const onClickAPI = (api: API) => {
    const swaggerDocs = docsState.docsList.find(
      (doc) => doc.id === id
    )?.swaggerDocs;

    push("/request", {
      ...transformApiFromSwagger(swaggerDocs, api),
      host: api.path,
    });
  };

  const { SubItem } = useSubItem({
    steps: STEPS,
    items: ["API Docs", "API Sequence"],
  });

  return (
    <div id="main" className={apiListStyle.app}>
      <Header
        headerTitle={docsState.docsList.find((doc) => doc.id === id)?.title}
        showBackButton
        backTo={navigationPath.API_문서_퍼널().API_문서_페이지}
        rightButton={
          <div className={apiListStyle.settingButtonWrapper}>
            <Dropdown>
              <Dropdown.Trigger as={<Button color="purple">Edit</Button>} />
              <Dropdown.Modal>
                <Dropdown.Item onClick={onClickDelete}>
                  Delete Sequence
                </Dropdown.Item>
              </Dropdown.Modal>
            </Dropdown>
            <Dropdown>
              <Dropdown.Trigger as={<Button color="purpleLarge">Add</Button>} />
              <Dropdown.Modal>
                <Dropdown.Item onClick={onClickAdd}>Metadata</Dropdown.Item>
                <Dropdown.Item onClick={onClickBringFromDocs}>
                  Bring from Docs
                </Dropdown.Item>
              </Dropdown.Modal>
            </Dropdown>
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

      <SubItem>
        <SubItem.Item name="API List">
          <div className={apiListStyle.searchWrapper}>
            <Search value={search} onChange={onChange} />
          </div>
          {!filteredApiList.tags?.length && (
            <BlankApi>
              There is no API
              <br />
              Please add API with the &quot;Add&quot; button.
            </BlankApi>
          )}
          {!!filteredApiList.tags?.length && (
            <ApiList apiList={filteredApiList} onClickAPI={onClickAPI} />
          )}
        </SubItem.Item>

        <SubItem.Item name="Sequence List">
          <div>API 순서 변경</div>
        </SubItem.Item>
      </SubItem>

      <SettingDrawer isOpen={open} onClose={closeDrawer} />
    </div>
  );
};
