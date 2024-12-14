import { Link } from 'react-router';
import { SettingsPage } from '../SettingsPage';
import Button from '../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../Button/ButtonTypes';

export function SocietyManagementPage() {
  return (
    <SettingsPage
      title="Societies you manage"
      headerButtons={[
        <Link to="/settings/societies/new">
          <Button
            variant={ButtonVariants.Secondary}
            icon={ButtonIcons.Plus}
            type="button"
          />
        </Link>,
      ]}
    >
      TODO
    </SettingsPage>
  );
}
