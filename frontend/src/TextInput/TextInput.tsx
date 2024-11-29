import { ReactNode } from "react";
import classes from "./TextInput.module.css";

type TextInputProp = {
  icon?: ReactNode;
  placeholder: string;
  name: string;
};

export function TextInput(props: TextInputProp) {
  return (
    <div className={classes.container}>
      <input
        type="text"
        name={props.name}
        placeholder={props.placeholder}
        className={classes.input}
      />
      <div className={classes.icon}>{props.icon && props.icon}</div>
    </div>
  );
}
