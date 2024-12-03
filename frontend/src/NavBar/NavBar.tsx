import classes from "./NavBar.module.css";
import pyramidIcon from "../assets/pyramidIcon.svg";
import { NavLink, useLocation } from "react-router";
import { useEffect } from "react";

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
