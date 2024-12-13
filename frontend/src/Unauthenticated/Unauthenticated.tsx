import { Link } from "react-router";
import classes from "./Unauthenticated.module.css";

export const Unauthenticated = () => {
  return (
    <main className={classes.container}>
      <article>
        <p>Sorry, you don't permission to view this page.</p>
        <p>
          Are you <Link to="/login">logged in?</Link>
        </p>
        <p>
          <Link to="/">Home</Link>
        </p>
      </article>
    </main>
  );
};
