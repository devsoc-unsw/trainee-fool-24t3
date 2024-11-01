import classes from './NavBar.module.css';
import pyramidIcon from '../assets/pyramidIcon.svg';

export type NavBarProps = {
  profileImage: string;
}

function NavBar(props: NavBarProps) {
  return (
    <nav className={classes.container}>
      <div className={classes.pyramids}>
        <img src={pyramidIcon} className={classes.logo} ></img>
        <h1 className={classes.title}>Pyramids</h1>
      </div>
      <div className={classes.pages}>
        <a>Timeline</a>
        <a>Calendar</a>
        <a>About</a>
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
