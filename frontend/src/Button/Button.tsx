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
  variant: ButtonOptions;
  className?: string;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

function Button(props: ButtonProps) {
  return (
    <button className={classes.button} type={props.type}>
      {props.variant === ButtonOptions.Plus && (
        <PlusIcon
          className={`${classes.icon} ${
            props.className ? props.className : ""
          }`}
        ></PlusIcon>
      )}

      {props.variant === ButtonOptions.Bookmark && (
        <BookmarkIcon
          className={`${classes.icon} ${
            props.className ? props.className : ""
          }`}
        ></BookmarkIcon>
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
