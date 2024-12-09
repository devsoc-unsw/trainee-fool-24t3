import {
  CalendarIcon,
  KeyIcon,
  MegaphoneIcon,
  StarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import classes from './SettingsNavbar.module.css';
import { NavLink, useLocation } from 'react-router';

interface Row {
  icon: React.ReactNode;
  name: string;
  to?: string;
  onClick?: () => void;
}

const rows: Row[][] = [
  [
    {
      icon: <UserCircleIcon />,
      name: 'Profile',
      to: '/settings/profile',
    },
  ],
  [
    {
      icon: <CalendarIcon />,
      name: 'Event Management',
      to: '/settings/events',
    },
    {
      icon: <StarIcon />,
      name: 'Create a new event',
      to: '/settings/events/new',
    },
  ],
  [
    {
      icon: <MegaphoneIcon />,
      name: 'Discord integration',
      to: '/settings/discord',
    },
  ],
  [
    {
      icon: <KeyIcon />,
      name: 'Log out',
      onClick: () => {
        alert('hello');
      },
    },
  ],
];

export function SettingsNavbar() {
  const { pathname } = useLocation();

  return (
    <nav className={classes.container}>
      {rows.map((section, i) => (
        <section key={i} className={classes.section}>
          {section.map((row, j) => (
            <div
              key={j}
              className={
                row.onClick
                  ? `${classes.row} ${classes.interactable}`
                  : classes.row
              }
              {...(row.onClick && { onClick: row.onClick })}
            >
              <div className={classes.icon}>{row.icon}</div>
              {row.to ? (
                <NavLink
                  className={
                    pathname === row.to
                      ? `${classes.link} ${classes.active}`
                      : classes.link
                  }
                  to={row.to}
                >
                  {row.name}
                </NavLink>
              ) : (
                <p>{row.name}</p>
              )}
            </div>
          ))}
        </section>
      ))}
    </nav>
  );
}
