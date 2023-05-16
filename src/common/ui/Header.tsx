import { useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import { headerStyle } from "./styles/header.css";
import { vars } from "./styles/theme.css";
interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className={headerStyle.header}>
      <div className={headerStyle.left}>
        <BiChevronLeft
          color={vars.color.white}
          size={35}
          onClick={() => navigate(-1)}
        />
      </div>
    </header>
  );
};

export default Header;
