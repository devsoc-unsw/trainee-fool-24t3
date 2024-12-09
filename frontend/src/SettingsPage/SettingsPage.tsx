import { Outlet } from 'react-router';
import { SettingsNavbar } from './SettingsNavbar/SettingsNavbar';
import classes from './SettingsPage.module.css';

export function SettingsPage() {
  return (
    <div className={classes.page}>
      <SettingsNavbar />
      <Outlet />
    </div>
  );
}
