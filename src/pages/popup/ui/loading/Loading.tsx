import { blankStyle } from "../styles/blank.css";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className={blankStyle.content}>
      <HashLoader color="#36d7b7" />
    </div>
  );
};

export default Loading;
