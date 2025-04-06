import { transformApiAddToInformation } from "@/entities/api/lib/transformApiAddToInformation";
import { ApiAddFunnelProps } from "@/pages/popup/pages/ApiAddFunnel/ApiAddFunnel";
import { apiListStyle } from "@/pages/popup/pages/ApiList/ui/apiList.css";
import BottomFixedButton from "@/shared/ui/Button/BottomFixedButton";
import Header from "@/shared/ui/Header";
import { useApiAddForm } from "../../module/hooks/useApiAddForm";
import { apiAddStyles } from "./ApiAdd.css";
import Section from "./core/Section";

// Import newly created components
import { ApiPathInput } from "./core/ApiPathInput";
import { HttpMethodSelector } from "./core/HttpMethodSelector";
import { ParametersSectionContent } from "./core/ParametersSectionContent";
import { RequestBodyMetadata } from "./core/RequestBodyMetadata";
import { SchemaPropertiesList } from "./core/SchemaPropertiesList";

type ApiAddProps = ApiAddFunnelProps & {
  form: ReturnType<typeof useApiAddForm>;
  onNext: () => void;
};

export default function ApiAdd({ form }: ApiAddProps) {
  const handleSave = () => {
    const formData = form.getFormData();
    const informationData = transformApiAddToInformation(formData);
    console.log("--- Form Data (EnhancedApiAdd) ---");
    console.log(formData);
    console.log("--- Transformed Data (Information) ---");
    console.log(JSON.stringify(informationData, null, 2));
    alert("API data logged to console. Check the developer tools.");
    // onNext(); // Or handle navigation
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
}
