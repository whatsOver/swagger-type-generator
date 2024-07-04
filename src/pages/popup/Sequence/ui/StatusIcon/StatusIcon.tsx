import { vars } from "@/shared/ui/styles/theme.css";
import { FiLoader as LoadingIcon } from "react-icons/fi";
import { IoCheckmarkCircleSharp as CheckIcon } from "react-icons/io5";
import { MdOutlineError as FailIcon } from "react-icons/md";
import { IconType } from "../../../../../entities/sequence/model/sequence-store";

const StatusIcon = ({ iconType }: { iconType: IconType }) => {
  switch (iconType) {
    case "SUCCESS":
      return <CheckIcon color={vars.color.green} size={24} />;
    case "FAIL":
      return <FailIcon color={vars.color.red} size={24} />;
    case "LOADING":
      return <LoadingIcon color={vars.color.orange} size={24} />;
  }
};

export default StatusIcon;
