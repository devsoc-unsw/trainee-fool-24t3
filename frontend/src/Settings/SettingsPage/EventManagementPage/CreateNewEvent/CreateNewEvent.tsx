import Button, { ButtonIcons, ButtonVariants } from '../../../../Button/Button';
import { SettingsPage } from '../../SettingsPage';
import classes from './CreateNewEvent.module.css';

export function CreateNewEventPage() {
  return (
    <SettingsPage
      title="Create a new event"
      pageAbovePath="/events"
      headerButtons={[
        <Button
          variant={ButtonVariants.Primary}
          icon={ButtonIcons.Plus}
          type="button"
        />,
      ]}
    >
      <p>TODO</p>
    </SettingsPage>
  );
}
