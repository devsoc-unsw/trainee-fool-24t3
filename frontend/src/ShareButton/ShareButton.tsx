import { ShareIcon } from "@heroicons/react/24/outline";
import classes from "./ShareButton.module.css";

type ShareButtonProps = {
  className?: string;
};

function ShareButton(props: ShareButtonProps) {
  return (
    <button 
      className={`${classes.share} ${
        props.className ? props.className : ""
      }`
    }>
      <ShareIcon className={classes.shareIcon}></ShareIcon>
    </button>
  );
}

export default ShareButton;
