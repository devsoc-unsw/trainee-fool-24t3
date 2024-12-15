import { Link, useLocation } from 'react-router';
import Button from '../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../Button/ButtonTypes';
import { SettingsPage } from '../SettingsPage';
import { useEffect } from 'react';
import classes from './EventManagementPage.module.css';

export function EventManagementPage() {
  const location = useLocation();
  const { creationSuccess } = location.state;

  useEffect(() => {
    const getEvents = async () => {
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
      {creationSuccess && (
        <div className={classes.success}>
          <p>Event created!</p>
        </div>
      )}
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
