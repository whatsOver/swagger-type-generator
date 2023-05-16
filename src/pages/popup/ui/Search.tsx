import Input, { InputProps } from "@src/common/ui/Input";
import { BiSearch } from "react-icons/bi";
import { searchStyle } from "./styles/search.css";
import { vars } from "@src/common/ui/styles/theme.css";

const Search = ({ value, onChange }: InputProps) => {
  return (
    <section className={searchStyle.search}>
      <BiSearch color={vars.color.white} className={searchStyle.icon} />
      <Input
        value={value}
        onChange={onChange}
        style={{ paddingLeft: "35px" }}
      />
    </section>
  );
};

export default Search;
