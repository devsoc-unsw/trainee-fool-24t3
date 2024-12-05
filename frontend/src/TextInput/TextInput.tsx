import { ReactNode, useState } from "react";
import classes from "./TextInput.module.css";

type TextInputProp = {
  icon?: ReactNode;
  placeholder: string;
  name: string;
};

export function TextInput(props: TextInputProp) {
  const [focus, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);
  return (
    <div className={`${classes.container} ${focus ? classes.focus : ""}`}>
      <input
        type="text"
        name={props.name}
        placeholder={props.placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        className={classes.input}
      />
      <div className={classes.icon}>{props.icon && props.icon}</div>
    </div>
  );
}
