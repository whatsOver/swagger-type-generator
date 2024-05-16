import Input, { InputProps } from "@src/common/ui/Input";
import { vars } from "@src/common/ui/styles/theme.css";
import { BiSearch } from "react-icons/bi";
import { searchStyles } from "./styles/search.css";

const Search = ({ value, onChange }: InputProps) => {
  return (
    <section className={searchStyles.search}>
      <BiSearch color={vars.color.white} className={searchStyles.icon} />
      <Input
        value={value}
        onChange={onChange}
        style={{ paddingLeft: "35px" }}
      />
    </section>
  );
};

export default Search;
