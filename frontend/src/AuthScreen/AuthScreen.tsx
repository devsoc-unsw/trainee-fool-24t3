import { ReactNode, FormEvent, Fragment } from "react";
import classes from "./AuthScreen.module.css";
import Button from "../Button/Button";
import { AuthError } from "../errorHandler";
import { ButtonVariants } from "../Button/ButtonTypes";

type AuthScreenProp = {
  heading: string;
  text: ReactNode; //this is the text in the p tag of the header
  inputs: ReactNode[];
  buttonText: string;
  footer?: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error?: AuthError;
  success?: string;
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
          {props.inputs.map((input: ReactNode, index) => (
            <Fragment key={index}>{input}</Fragment>
          ))}
          <Button
            variant={ButtonVariants.Primary}
            type="submit"
            className={classes.button}
          >
            {props.buttonText}
          </Button>
        </form>
      </main>

      <footer className={classes.footer}>
        {props.footer && <div>{props.footer}</div>}{" "}
        {props.success && (
          <div className={classes.success}>
            <p>{props.success}</p>
          </div>
        )}
        {props.error && (
          <div>
            <p className={classes.error}>{props.error.message}</p>
          </div>
        )}
      </footer>
    </div>
  );
}
