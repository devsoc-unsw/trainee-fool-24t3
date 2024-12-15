import { Link, useLocation } from 'react-router';
import Button from '../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../Button/ButtonTypes';
import { SettingsPage } from '../SettingsPage';
import { useContext, useEffect, useState } from 'react';
import classes from './EventManagementPage.module.css';
import { UserContext } from '../../../UserContext/UserContext';

interface SocietyEvent {
  banner: string,
  description: string,
  id: number,
  startDateTime: Date,
  endDateTime: Date,
  location: string,
  name: string,
  societyId: number,
}

export function EventManagementPage() {
  const location = useLocation();
  const { creationSuccess } = location.state ? location.state : { creationSuccess: false };
  const { society } = useContext(UserContext);
  const [events, setEvents] = useState<SocietyEvent[]>([]);

  useEffect(() => {
    if(society) {
      const getEvents = async () => {
        const events = await fetch(
          'http://localhost:5180/society/events?' +
            new URLSearchParams({
              id: String(society?.id),
            }),
          {
            method: 'GET',
            credentials: 'include',
          }
        );
  
          const eventsJson: SocietyEvent[] = await events.json();
          setEvents(eventsJson.map((event) => {return {...event, startDateTime: new Date(event.startDateTime), endDateTime: new Date(event.endDateTime)}}));
      };
      getEvents();
    }
  }, [society]);

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
        <tbody>
          {events && events.map((event) => 
            <tr>
              <td>{event.name}</td>
              <td>{event.endDateTime.toLocaleDateString('en-GB')}</td>
              <td>{event.location}</td>
            </tr>
          )}
        </tbody>
      </table>
    </SettingsPage>
  );
}
