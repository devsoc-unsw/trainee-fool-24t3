import {
  CalendarIcon,
  FaceSmileIcon,
  KeyIcon,
  MegaphoneIcon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import classes from './SettingsNavbar.module.css';
import { NavLink, useLocation } from 'react-router';
import { useContext } from 'react';
import { User, UserContext } from '../../UserContext/UserContext';

interface Row {
  icon: React.ReactNode;
  name: string;
  to?: string;
  onClick?: (() => void) | ((state: any) => void);
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
      icon: <UserGroupIcon />,
      name: 'Society Management',
      to: '/settings/societies',
    },
    {
      icon: <FaceSmileIcon />,
      name: 'Create a new society',
      to: '/settings/societies/new',
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
      onClick: async (state: {
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
      }) => {
        const logout = await fetch('http://localhost:5180/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        if (logout.ok) {
          state.setUser(null);
        } else {
          alert('Failed to logout.');
        }
      },
    },
  ],
];

export function SettingsNavbar() {
  const { pathname } = useLocation();
  const { setUser } = useContext(UserContext);

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
              {...{
                onClick: (_) =>
                  row.onClick &&
                  row.onClick({
                    setUser,
                  }),
              }}
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
