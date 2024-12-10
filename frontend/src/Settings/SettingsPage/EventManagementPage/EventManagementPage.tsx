import Button from '../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../Button/ButtonTypes';
import { SettingsPage } from '../SettingsPage';

export function EventManagementPage() {
  return (
    <SettingsPage
      title="Events you manage"
      headerButtons={[
        <Button icon={ButtonIcons.Search} type="button" />,
        <Button
          variant={ButtonVariants.Secondary}
          icon={ButtonIcons.Plus}
          type="button"
        />,
      ]}
    >
      <p>TODO</p>
    </SettingsPage>
  );
}
