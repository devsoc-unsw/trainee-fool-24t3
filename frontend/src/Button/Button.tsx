import { PlusIcon } from "@heroicons/react/24/solid";
import classes from "./Button.module.css";
import { BookmarkIcon } from "@heroicons/react/24/outline";

export enum ButtonOptions {
  String,
  Plus,
  Bookmark,
}

type ButtonProps = {
  children?: string;
  type: ButtonOptions;
  className?: string;
};

function Button(props: ButtonProps) {
  return (
    <button className={classes.button}>
      {props.type === ButtonOptions.Plus && (
        <PlusIcon className={`${classes.icon} ${props.className}`}></PlusIcon>
      )}

      {props.type === ButtonOptions.Bookmark && (
        <BookmarkIcon className={`${classes.icon} ${props.className}`}></BookmarkIcon>
      )}

      {props.type === ButtonOptions.String && (
        <span className={`${classes.string} ${props.className}`}>{props.children}</span>
      )}
    </button>
  );
}

export default Button;
