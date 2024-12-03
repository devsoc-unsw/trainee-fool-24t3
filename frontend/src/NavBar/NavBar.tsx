import classes from "./NavBar.module.css";
import pyramidIcon from "../assets/pyramidIcon.svg";
import { NavLink } from "react-router";

export type NavBarProps = {
  profileImage: string;
};

function NavBar(props: NavBarProps) {
  return (
    <nav className={classes.container}>
      <div className={classes.pyramids}>
        <img src={pyramidIcon} className={classes.logo}></img>
        <h1>
          <NavLink to="/">Pyramids</NavLink>
        </h1>
      </div>
      <div className={classes.pages}>
        <NavLink to="/timeline">Timeline</NavLink>
        <NavLink to="/timeline?view=calendar">Calendar</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      <div
        className={classes.profile}
        style={{
          backgroundImage: `url(${props.profileImage})`,
        }}
      ></div>
    </nav>
  );
}

export default NavBar;
