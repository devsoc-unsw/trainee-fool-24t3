import classes from "./BackButton.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

function BackButton() {
  return (
    <button className={classes.back}>
      <ChevronLeftIcon className={classes.chevronIcon}></ChevronLeftIcon>
    </button>
  );
}

export default BackButton;
