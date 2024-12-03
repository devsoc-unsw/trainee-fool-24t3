import classes from "./HomePage.module.css";
import logo from "../assets/pyramidIcon.svg";

export default function HomePage() {
  return (
    <div className={classes.homePage}>
      <header className={classes.header}>
        <img className={classes.logo} src={logo} alt="Pyramids logo" />
        <h1>Pyramids</h1>
      </header>
      <main className={classes.main}>
        <h2>Welcome!</h2>
        <p>Click the icon in the bottom right to log in.</p>
      </main>
    </div>
  );
}
