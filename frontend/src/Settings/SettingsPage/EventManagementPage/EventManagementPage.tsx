import { Link } from 'react-router';
import Button from '../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../Button/ButtonTypes';
import { SettingsPage } from '../SettingsPage';
import { useEffect } from 'react';

export function EventManagementPage() {
  useEffect(() => {
    const getEvents = async () => {
      const societies = await fetch('http://localhost:5180/user/societies', {
        method: 'GET',
        credentials: 'include',
      });

      if (societies.ok) {
        const societiesJson = await societies.json();
        console.log(societiesJson);
      }

      const events = await fetch(
        'http://localhost:5180/society/events?' +
          new URLSearchParams({
            id: '1',
          }),
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (events.ok) {
        const eventsJson = await events.json();
        console.log(eventsJson);
      }
    };
    getEvents();
  }, []);

  return (
    <SettingsPage
      title="Events you manage"
      headerButtons={[
        <Button icon={ButtonIcons.Search} type="button" />,
        <Link to="/settings/events/new">
          <Button
            variant={ButtonVariants.Secondary}
            icon={ButtonIcons.Plus}
            type="button"
          />
        </Link>,
      ]}
    >
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>When</th>
            <th>Where</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </SettingsPage>
  );
}
