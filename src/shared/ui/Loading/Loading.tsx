import HashLoader from "react-spinners/HashLoader";
import { blankStyle } from "../blank-item/blank.css";

const Loading = () => {
  return (
    <div className={blankStyle.content}>
      <HashLoader color="#36d7b7" />
    </div>
  );
};

export default Loading;
