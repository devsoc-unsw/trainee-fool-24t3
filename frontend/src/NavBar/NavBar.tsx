import classes from './NavBar.module.css';
import pyramidIcon from '../assets/pyramidIcon.svg';

export type NavBarProps = {
  profileImage: string;
  timeline?: boolean;
  calendar?: boolean;
  about?: boolean;
}

function NavBar(props: NavBarProps) {
  return (
    <div className={classes.container}>
      <div className={classes.pyramids}>
        <img src={pyramidIcon} className={classes.logo} ></img>
        <h1 className={classes.title}>Pyramids</h1>
      </div>
      <div className={classes.pages}>
        <h1>Timeline</h1>
        <h1>Calendar</h1>
        <h1>About</h1>
      </div>
      <div 
        className={classes.profile}
        style={{
          backgroundImage: `url(${props.profileImage})`,
        }}
      ></div>
    </div>
  );
}

export default NavBar;
