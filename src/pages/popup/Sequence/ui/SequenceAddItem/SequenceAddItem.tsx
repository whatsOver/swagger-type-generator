import { vars } from "@src/common/ui/styles/theme.css";
import { FiLoader as LoadingIcon } from "react-icons/fi";
import {
  IoCheckmarkCircleSharp as CheckIcon,
  IoCloseCircle as CloseIcon,
} from "react-icons/io5";
import { MdOutlineError as FailIcon } from "react-icons/md";
import { sequenceAddItemStyles } from "./sequenceAdd.css";

type IconType = "SUCCESS" | "FAIL" | "LOADING";

export interface SequenceAddItemProps {
  title: string;

  onChangeTitle: (title: string) => void;
  onPressEnter: () => void;
  onClickClose: () => void;
}

const SequenceAddItem = ({
  title,
  onChangeTitle,
  onPressEnter,
  onClickClose,
}: SequenceAddItemProps) => {
  return (
    <div className={sequenceAddItemStyles.wrapper}>
      <div className={sequenceAddItemStyles.left}>
        <Icon iconType={"LOADING"} />
      </div>
      <div className={sequenceAddItemStyles.right}>
        <input
          className={sequenceAddItemStyles.input}
          value={title}
          autoFocus
          onChange={(e) => onChangeTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              onPressEnter();
            }
          }}
        />
      </div>
      <div className={sequenceAddItemStyles.iconsWrapper}>
        <div onClick={onPressEnter} className={sequenceAddItemStyles.checkIcon}>
          <CheckIcon size={24} color={vars.color.green} />
        </div>
        <div onClick={onClickClose} className={sequenceAddItemStyles.closeIcon}>
          <CloseIcon size={24} color={vars.color.red} />
        </div>
      </div>
    </div>
  );
};

export default SequenceAddItem;

const Icon = ({ iconType }: { iconType: IconType }) => {
  switch (iconType) {
    case "SUCCESS":
      return <CheckIcon color={vars.color.green} size={24} />;
    case "FAIL":
      return <FailIcon color={vars.color.red} size={24} />;
    case "LOADING":
      return <LoadingIcon color={vars.color.orange} size={24} />;
  }
};
