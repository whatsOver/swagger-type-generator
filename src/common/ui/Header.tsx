import { useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import { headerStyle } from "./styles/header.css";
import { vars } from "./styles/theme.css";
interface HeaderProps {
  showBackButton?: boolean;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

const Header = ({
  showBackButton = false,
  leftButton,
  rightButton,
}: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className={headerStyle.header}>
      <div className={headerStyle.left}>
        {showBackButton && (
          <BiChevronLeft
            color={vars.color.white}
            size={35}
            onClick={() => navigate(-1)}
          />
        )}
        {leftButton}
      </div>
      <div className={headerStyle.right}>{rightButton}</div>
    </header>
  );
};

export default Header;
