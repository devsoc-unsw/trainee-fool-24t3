import { ReactNode } from "react";
import classes from "./AuthScreen.module.css";

type AuthScreenProp = {
  heading: string;
  text: ReactNode; //this is the text in the p tag of the header
  inputs: ReactNode[];
  buttonText: string;
  footer?: ReactNode;
};

export function AuthScreen(props: AuthScreenProp) {
  return (
    <div>
      <header>
        <h1>{props.heading}</h1>
        <p>{props.text}</p>
      </header>
      <main>
        <form>
          {props.inputs.map((input: ReactNode) => input)}{" "}
          <button type="button" className={classes.button}>
            {props.buttonText}
          </button>{" "}
        </form>
      </main>
      {props.footer && <footer>{props.footer}</footer>}
    </div>
  );
}
