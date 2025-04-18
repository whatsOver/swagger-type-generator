import { transformApiAddToInformation } from "@/entities/api/lib/transformApiAddToInformation";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import { DocsApiListFunnelProps } from "@/pages/popup/pages/DocsApiListFunnel/DocsApiListFunnel";
import BottomFixedButton from "@/shared/ui/Button/BottomFixedButton";
import Header from "@/shared/ui/Header";
import { useApiAddForm } from "../../module/hooks/useApiAddForm";
import { apiAddStyles } from "./ApiAdd.css";
import Section from "./core/Section";

import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { ApiPathInput } from "./core/ApiPathInput";
import { HttpMethodSelector } from "./core/HttpMethodSelector";
import { ParametersSectionContent } from "./core/ParametersSectionContent";
import { RequestBodyMetadata } from "./core/RequestBodyMetadata";
import { SchemaPropertiesList } from "./core/SchemaPropertiesList";

type ApiAddProps = DocsApiListFunnelProps & {
  form: ReturnType<typeof useApiAddForm>;
  onNext: () => void;
};

export const ApiAdd = ({ id, form, onNext }: ApiAddProps) => {
  const { addPathToDoc } = useDocsStore();

  const handleSave = () => {
    const formData = form.getFormData();
    const informationData = transformApiAddToInformation(formData);
    try {
      addPathToDoc(id, {
        method: formData.method,
        path: formData.path,
        information: informationData,
      });
      onNext();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div id="main" className={apiListStyle.app}>
      <Header showBackButton headerTitle="API Spec - Details" />
      <div className={apiAddStyles.content}>
        {/* --- HTTP Method --- */}
        <HttpMethodSelector method={form.method} setMethod={form.setMethod} />

        {/* --- Path Input --- */}
        <ApiPathInput path={form.path} setPath={form.setPath} />

        {/* --- Parameters Section --- */}
        <Section
          title="Parameters"
          labelStyle={apiAddStyles.paramsLabel}
          buttonColor="green"
          onAdd={form.handleAddParameter}
        >
          <ParametersSectionContent
            parameters={form.parameters}
            onRemove={form.handleRemoveParameter}
            onChange={form.handleParameterChange}
          />
        </Section>

        {/* --- Request Body Section --- */}
        <Section
          title="Request Body"
          labelStyle={apiAddStyles.bodyLabel}
          buttonColor="blue"
          onAdd={form.handleAddRequestBodySchemaProp}
        >
          <RequestBodyMetadata
            contentType={form.requestBodyContentType}
            setContentType={form.setRequestBodyContentType}
            required={form.requestBodyRequired}
            setRequired={form.setRequestBodyRequired}
            description={form.requestBodyDescription}
            setDescription={form.setRequestBodyDescription}
          />
          <SchemaPropertiesList
            properties={form.requestBodySchemaProps}
            // Pass handlers directly for Request Body context
            onRemove={form.handleRemoveRequestBodySchemaProp}
            onChange={form.handleRequestBodySchemaPropChange}
          />
        </Section>

        {/* --- Responses Section --- */}
        {/* <Section
          title="Responses"
          labelStyle={apiAddStyles.responseLabel}
          buttonColor="blue" // Or 'purple' if supported
          onAdd={form.handleAddResponse}
        >
          <ResponsesSectionContent
            responses={form.responses}
            onRemoveResponse={form.handleRemoveResponse}
            onResponseChange={form.handleResponseChange}
            onAddSchemaProp={form.handleAddResponseSchemaProp}
            onRemoveSchemaProp={form.handleRemoveResponseSchemaProp}
            onSchemaPropChange={form.handleResponseSchemaPropChange}
          />
        </Section> */}
      </div>

      {/* Bottom Button */}
      <BottomFixedButton>
        <BottomFixedButton.First onClick={handleSave}>
          SAVE & LOG
        </BottomFixedButton.First>
      </BottomFixedButton>
    </div>
  );
};
