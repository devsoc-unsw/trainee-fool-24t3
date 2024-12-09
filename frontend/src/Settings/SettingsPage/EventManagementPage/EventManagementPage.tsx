import Button, { ButtonIcons, ButtonVariants } from '../../../Button/Button';
import { SettingsPage } from '../SettingsPage';

export function EventManagementPage() {
  return (
    <SettingsPage
      title="Events you manage"
      headerButtons={[
        <Button
          variant={ButtonVariants.Primary}
          icon={ButtonIcons.Plus}
          type="button"
        />,
      ]}
    >
      <p>Hello</p>
    </SettingsPage>
  );
}
