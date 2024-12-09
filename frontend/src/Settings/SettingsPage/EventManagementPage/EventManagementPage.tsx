import Button, { ButtonIcons, ButtonVariants } from '../../../Button/Button';
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
      <p>Hello</p>
    </SettingsPage>
  );
}
