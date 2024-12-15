import { ReactNode, useState, ChangeEvent } from 'react';
import classes from './TextInput.module.css';

export enum TextOptions {
  Text = 'text',
  Password = 'password',
  Email = 'email',
}

type TextInputProp = {
  icon?: ReactNode;
  placeholder: string;
  name: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type: TextOptions;
  error: boolean;
  noMargin?: boolean;
};

export function TextInput(props: TextInputProp) {
  const [focus, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    props.onChange(value);
  }

  return (
    <div
      className={`${classes.container} ${focus ? classes.focus : ''} ${
        props.error ? classes.error : ''
      }`}
      style={{ marginBottom: props.noMargin ? '0' : '' }}
    >
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        className={classes.input}
        onChange={handleChange}
      />
      <div className={classes.icon}>{props.icon && props.icon}</div>
    </div>
  );
}
