import { SettingsPage } from '../SettingsPage';
import classes from './ProfilePage.module.css';

export function ProfilePage() {
  return (
    <SettingsPage title="Profile" headerButtons={[]}>
      <section className={classes.heading}>
        <img
          src="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"
          alt="Profile picture"
        />
        <h2>John Pharoah</h2>
      </section>
    </SettingsPage>
  );
}
