import classes from "./NavBar.module.css";
import pyramidIcon from "../assets/pyramidIcon.svg";
import { NavLink, useLocation } from "react-router";

export type NavBarProps = {
  profileImage: string;
};

function NavBar(props: NavBarProps) {
  const { search } = useLocation();
  const view = new URLSearchParams(search).get("view");

  return (
    <nav className={classes.container}>
      <div className={classes.pyramids}>
        <img src={pyramidIcon} className={classes.logo}></img>
        <h1>
          <NavLink to="/">Pyramids</NavLink>
        </h1>
      </div>
      <div className={classes.pages}>
        <NavLink
          className={({ isActive }) =>
            isActive && view === null ? classes.active : ""
          }
          to="/timeline"
        >
          Timeline
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive && view === "calendar" ? classes.active : ""
          }
          to="/timeline?view=calendar"
        >
          Calendar
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to="/about"
        >
          About
        </NavLink>
      </div>

      <NavLink
        className={({ isActive }) =>
          isActive
            ? `${classes.loginLink} ${classes.active}`
            : classes.loginLink
        }
        style={{
          backgroundImage: `url(${props.profileImage})`,
        }}
        to="/settings"
      ></NavLink>
    </nav>
  );
}

export default NavBar;
