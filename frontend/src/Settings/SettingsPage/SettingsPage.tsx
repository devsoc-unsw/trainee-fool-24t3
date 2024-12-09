import classes from './SettingsPage.module.css';

export interface SettingsPageProps {
  title: string;
  headerButtons?: React.ReactNode[];
  pageAbovePath?: string;
  children: React.ReactNode;
}

export function SettingsPage(props: SettingsPageProps) {
  return (
    <div className={classes.settingsPage}>
      <div className={classes.headerContainer}>
        {props.pageAbovePath && <button>Back</button>}
        <header className={classes.header}>
          <h1>{props.title}</h1>
          {props.headerButtons && (
            <div className={classes.headerButtons}>
              {props.headerButtons.map((button) => button)}
            </div>
          )}
        </header>
      </div>
      <main>{props.children}</main>
    </div>
  );
}
