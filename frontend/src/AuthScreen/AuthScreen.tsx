import { ReactNode } from 'react';
import classes from './AuthScreen.module.css';
import Button from '../Button/Button';

type AuthScreenProp = {
  heading: string;
  text: ReactNode; //this is the text in the p tag of the header
  inputs: ReactNode[];
  buttonText: string;
  footer?: ReactNode;
};

export function AuthScreen(props: AuthScreenProp) {
  return (
    <div className={classes.container}>
      <header>
        <h1>{props.heading}</h1>
        <p>{props.text}</p>
      </header>
      <main>
        <form className={classes.form}>
          {props.inputs.map((input: ReactNode) => input)}
          <Button type="submit" className={classes.button}>
            {props.buttonText}
          </Button>
        </form>
      </main>
      {props.footer && <footer>{props.footer}</footer>}
    </div>
  );
}
