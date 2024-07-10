import { BiError as ErrorIcon } from "react-icons/bi";
import { vars } from "../styles/theme.css";
import { blankStyle } from "./blank.css";

interface BlankItemProps {
  children: React.ReactNode;
}

const BlankItem = ({ children }: BlankItemProps) => {
  return (
    <div className={blankStyle.content}>
      <ErrorIcon size={70} color={vars.color.yellow} />
      <span className={blankStyle.description}>{children}</span>
    </div>
  );
};

export default BlankItem;
