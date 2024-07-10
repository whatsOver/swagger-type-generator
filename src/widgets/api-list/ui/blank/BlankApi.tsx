import { vars } from "@/shared/ui/styles/theme.css";
import { BiError as ErrorIcon } from "react-icons/bi";
import { blankStyle } from "../../../../shared/ui/blank-item/blank.css";

const BlankApi = () => {
  return (
    <div className={blankStyle.content}>
      <ErrorIcon size={70} color={vars.color.yellow} />
      <span className={blankStyle.description}>
        You are not on the correct Swagger page, or the Swagger version is not
        supported.
        <br />
        Please ensure that you are on the correct page and that your Swagger
        version is 3.
      </span>
    </div>
  );
};

export default BlankApi;
