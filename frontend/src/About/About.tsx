import classes from "./About.module.css";
import logo from "../assets/pyramidIcon.svg";

export default function AboutPage() {
  return (
    <div className={classes.aboutPage}>
      <header className={classes.header}>
        <img className={classes.logo} src={logo} alt="Pyramids logo" />
        <h1>Pyramids</h1>
      </header>
      <main className={classes.main}>
        <h2>Pyramids is by:</h2>
        <ul>
          <li>Aaron Fang</li>
          <li>Isaac Kim</li>
          <li>Jared Schultz</li>
          <li>Lachlan Shoesmith</li>
          <li>Ricky Pham</li>
          <li>Vincent Tannos</li>
        </ul>
      </main>
      <footer className={classes.footer}>
        <a href="https://github.com/devsoc-unsw/trainee-fool-24t3">GitHub</a>
        <code>\o/</code>
      </footer>
    </div>
  );
}
