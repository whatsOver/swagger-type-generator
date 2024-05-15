import HashLoader from "react-spinners/HashLoader";
import { loadingStyles } from "./loading.css";

interface LoadingProps {
  onClick?: () => void;
}

const FullPageLoading = ({ onClick }: LoadingProps) => {
  return (
    <div onClick={onClick} className={loadingStyles.wrapper}>
      <HashLoader color="#36d7b7" />
    </div>
  );
};

export default FullPageLoading;
