import {
  CalendarIcon,
  MegaphoneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import classes from './SettingsNavbar.module.css';

interface Row {
  icon: React.ReactNode;
  name: string;
  to?: string;
}

const rows: Row[][] = [
  [
    {
      icon: <CalendarIcon />,
      name: 'Event Management',
    },
    {
      icon: <StarIcon />,
      name: 'Events',
    },
    {
      icon: <MegaphoneIcon />,
      name: 'Discord Integration',
    },
  ],
];

export function SettingsNavbar() {
  return (
    <nav className={classes.container}>
      {rows.map((section, i) => (
        <section key={i} className={classes.section}>
          {section.map((row, j) => (
            <div key={j} className={classes.row}>
              <div className={classes.icon}>{row.icon}</div>
              <p>{row.name}</p>
            </div>
          ))}
        </section>
      ))}
    </nav>
  );
}
