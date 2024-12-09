import { PlusIcon } from "@heroicons/react/24/solid";
import classes from "./Button.module.css";
import { BookmarkIcon } from "@heroicons/react/24/outline";

export enum ButtonOptions {
  String,
  Plus,
  Bookmark,
  Share,
}

type ButtonProps = {
  children?: string;
  variant: ButtonOptions;
  className?: string;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

function Button(props: ButtonProps) {
  return (
    <button
      type={props.type}
      className={`${classes.button} ${props.className ? props.className : ""}`}
    >
      {props.variant === ButtonOptions.Plus && (
        <PlusIcon className={classes.icon}></PlusIcon>
      )}

      {props.variant === ButtonOptions.Bookmark && (
        <BookmarkIcon className={classes.icon}></BookmarkIcon>
      )}

      {props.variant === ButtonOptions.String && (
        <span
          className={`${classes.string} ${
            props.className ? props.className : ""
          }`}
        >
          {props.children}
        </span>
      )}
    </button>
  );
}

export default Button;
