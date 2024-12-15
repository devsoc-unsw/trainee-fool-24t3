import { Outlet } from 'react-router';
import { SettingsNavbar } from './SettingsNavbar/SettingsNavbar';
import classes from './Settings.module.css';
import { SocietyDropdown } from './SocietyDropdown/SocietyDropdown';

export function Settings() {
  return (
      <div className={classes.settings}>
        <SettingsNavbar />
        <Outlet />
        <SocietyDropdown />
      </div>
  );
}
