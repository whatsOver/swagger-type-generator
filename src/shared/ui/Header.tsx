import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { headerStyle } from "./styles/header.css";
import { vars } from "./styles/theme.css";
interface HeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  headerTitle?: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

const Header = ({
  showBackButton = false,
  backTo,
  headerTitle,
  leftButton,
  rightButton,
}: HeaderProps) => {
  const navigate = useNavigate();

  const onClickBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1);
  };

  return (
    <header className={headerStyle.header}>
      <div className={headerStyle.left}>
        {showBackButton && (
          <BiChevronLeft
            color={vars.color.white}
            size={35}
            onClick={onClickBack}
          />
        )}
        {leftButton}
        {headerTitle && (
          <span className={headerStyle.headerTitle}>{headerTitle}</span>
        )}
      </div>
      <div className={headerStyle.right}>{rightButton}</div>
    </header>
  );
};

export default Header;
