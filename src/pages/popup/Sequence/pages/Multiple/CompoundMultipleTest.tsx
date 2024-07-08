import { APIWithParamsOrBody } from "@/pages/content/modules/getApiList2";
import { HandleCodeReturn } from "@/pages/popup/hooks/Request/useHandleCode";
import Body from "@/pages/popup/ui/Body";
import ModalCodeBlock from "@/pages/popup/ui/CodeBlockView";
import Params from "@/pages/popup/ui/Params";
import { vars } from "@/shared/ui/styles/theme.css";
import { MdOutlineKeyboardArrowDown as ArrowDownIcon } from "react-icons/md";
import { VscBracketError as ErrorIcon } from "react-icons/vsc";
import { APIWithOrder } from "../../../../../entities/sequence/model/sequence-store";
import { OmitHandleFormValues } from "../../../../../features/request-api/module/hooks/useHandleRequest";
import { Mode } from "./MultipleTestPage";
import { multipleStyles } from "./multiple.css";

interface CompoundMultipleTestProps {
  children: React.ReactNode;
}

const CompoundMultipleTest = ({ children }: CompoundMultipleTestProps) => {
  return <div className={multipleStyles.multipleWrapper}>{children}</div>;
};

interface SequenceApiListProps {
  ApiList: APIWithOrder[];
  currentAPIKey: string;
  onChangeAPI: (key: string) => void;
}

const SequenceApiList = ({
  ApiList,
  currentAPIKey,
  onChangeAPI,
}: SequenceApiListProps) => {
  return (
    <ul className={multipleStyles.ApiListWrapper}>
      {ApiList.map((api, idx) => (
        <>
          <li
            style={{
              boxSizing: "border-box",
              backgroundColor: vars.methodColors[api.api.method],
              border:
                api.key === currentAPIKey
                  ? "2px solid white"
                  : `2px solid ${vars.methodColors[api.api.method]}`,
            }}
            className={multipleStyles.apiButton}
            key={api.key}
            onClick={() => onChangeAPI(api.key)}
          >
            <div className={multipleStyles.lineClamp}>
              {api.api.description}
            </div>
          </li>
          {idx !== ApiList.length - 1 && (
            <ArrowDownIcon size={24} color={vars.color.white} />
          )}
        </>
      ))}
    </ul>
  );
};

interface RequestProps extends OmitHandleFormValues {
  api: Omit<APIWithParamsOrBody, "host">;
  children: React.ReactNode;
}

const Request = ({
  api,
  formValues,
  handleArray,
  handleSubmit,
  handleChange,
  children,
}: RequestProps) => {
  return (
    <form className={multipleStyles.requestWrapper} onSubmit={handleSubmit}>
      <h2 className={multipleStyles.mainDescription}>{api?.description}</h2>
      <div className={multipleStyles.requestBlock}>
        {!!api.params?.length && (
          <Params
            params={api.params}
            formValues={formValues}
            handleChange={handleChange}
            handleArray={handleArray}
          />
        )}
        {!!api.body?.type.length && (
          <Body
            body={api.body}
            formValues={formValues}
            handleChange={handleChange}
            handleArray={handleArray}
          />
        )}
        {!api.params?.length && !api.body?.type.length && (
          <div className={multipleStyles.flexView}>
            <ErrorIcon size={26} color={vars.color.green} />
            <span className={multipleStyles.description}>
              No parameters or body
            </span>
          </div>
        )}
      </div>
      {children}
    </form>
  );
};

interface CodeBlockProps extends HandleCodeReturn {
  response: unknown;
  mode: Mode;
  initializeMode: () => void;
  setRequestMode: () => void;
}

const CodeBlock = ({
  response,
  mode,
  code,
  codeRef,
  copyToClipboard,
  onClickAxios,
  onClickFetch,
  onClickTS,
  initializeMode,
  setRequestMode,
}: CodeBlockProps) => {
  return (
    <div className={multipleStyles.requestWrapper}>
      {response && mode === "RESPONSE" && (
        <ModalCodeBlock
          description="Response"
          code={JSON.stringify(response, null, 2)}
          mode="RESPONSE"
          ref={codeRef}
          onClickCopy={copyToClipboard}
          onClickTS={onClickTS}
          onClickAxios={onClickAxios}
          onClickFetch={onClickFetch}
          isModal={false}
        />
      )}
      {mode === "TS" && (
        <ModalCodeBlock
          description="Type"
          code={code}
          mode="TS"
          ref={codeRef}
          onClickBack={initializeMode}
          onClickCopy={copyToClipboard}
          isModal={false}
        />
      )}
      {mode === "ERROR" && (
        <ModalCodeBlock
          description="Error"
          descriptionColor="red"
          code={JSON.stringify(response, null, 2)}
          mode="ERROR"
          ref={codeRef}
          onClickBack={setRequestMode}
          onClickCopy={copyToClipboard}
          isModal={false}
        />
      )}
      {mode === "AXIOS" && (
        <ModalCodeBlock
          description="AXIOS"
          descriptionColor="red"
          code={code}
          mode="AXIOS"
          ref={codeRef}
          onClickBack={initializeMode}
          onClickCopy={copyToClipboard}
          isModal={false}
        />
      )}
      {mode === "FETCH" && (
        <ModalCodeBlock
          description="FETCH"
          descriptionColor="orange"
          code={code}
          mode="FETCH"
          ref={codeRef}
          onClickBack={initializeMode}
          onClickCopy={copyToClipboard}
          isModal={false}
        />
      )}
    </div>
  );
};

CompoundMultipleTest.SequenceApiList = SequenceApiList;
CompoundMultipleTest.Request = Request;
CompoundMultipleTest.CodeBlock = CodeBlock;

export default CompoundMultipleTest;
