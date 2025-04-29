import { blankStyle } from "@/shared/ui/blank-item/blank.css";
import { vars } from "@/shared/ui/styles/theme.css";
import { ReactNode } from "react";
import { BiError as ErrorIcon } from "react-icons/bi";
interface BlankApiProps {
  children?: ReactNode;
}

const BlankApi = ({ children }: BlankApiProps) => {
  return (
    <div className={blankStyle.content}>
      <ErrorIcon size={70} color={vars.color.yellow} />
      {!children && (
        <span className={blankStyle.description}>
          You are not on the correct Swagger page, or the Swagger version is not
          supported.
          <br />
          Please ensure that you are on the correct page and that your Swagger
          version is 3.
        </span>
      )}
      {children && <div className={blankStyle.description}>{children}</div>}
    </div>
  );
};

export default BlankApi;
