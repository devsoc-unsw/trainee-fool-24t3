import { ReactNode, useState, ChangeEvent } from "react";
import classes from "./TextInput.module.css";

export enum TextOptions {
  Text = "text",
  Password = "password",
  Email = "email",
  Date = "date",
  Time = "time",
}

type TextInputProp = {
  autofocus?: boolean;
  className?: string;
  icon?: ReactNode;
  placeholder: string;
  name: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type: TextOptions;
  error: boolean;
  textarea?: boolean;
  value?: string;
};

export function TextInput(props: TextInputProp) {
  const [focus, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = event.target.value;
    props.onChange(value);
  }

  return (
    <div
      className={`${props.className ? props.className : classes.container} ${focus ? classes.focus : ""} ${
        props.error ? classes.error : ""
      }`}
    >
      {props.textarea ? 
        <textarea
          rows={6}
          name={props.name}
          placeholder={props.placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          className={classes.input}
          onChange={handleChange}
          autoFocus={props.autofocus}
          value={props.value}
        />
      : <input
          autoFocus={props.autofocus}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onFocus={onFocus}
          onBlur={onBlur}
          className={classes.input}
          onChange={handleChange}
        />}
      <div className={classes.icon}>{props.icon && props.icon}</div>
    </div>
  );
}
