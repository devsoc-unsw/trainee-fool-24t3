import { ReactNode, FormEvent } from "react";
import classes from "./AuthScreen.module.css";
import Button, { ButtonOptions } from "../Button/Button";
import { AuthError } from "../errorHandler";

type AuthScreenProp = {
  heading: string;
  text: ReactNode; //this is the text in the p tag of the header
  inputs: ReactNode[];
  buttonText: string;
  footer?: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error?: AuthError;
};

export function AuthScreen(props: AuthScreenProp) {
  return (
    <div className={classes.container}>
      <header>
        <h1>{props.heading}</h1>
        <p className={classes.headerText}>{props.text}</p>
      </header>
      <main>
        <form className={classes.form} onSubmit={props.onSubmit}>
          {props.inputs.map((input: ReactNode) => input)}
          <Button type="submit" className={classes.button}>
            {props.buttonText}
          </Button>
        </form>
      </main>

      <footer className={classes.footer}>
        {props.footer && <div>{props.footer}</div>}{" "}
        {props.error && (
          <div>
            <p className={classes.error}>{props.error.message}</p>
          </div>
        )}
      </footer>
    </div>
  );
}
