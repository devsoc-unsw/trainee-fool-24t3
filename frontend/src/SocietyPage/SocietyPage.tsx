import { useParams } from 'react-router';
import classes from './SocietyPage.module.css';
import { Society } from '../UserContext/UserContext';
import { ReactNode, useEffect, useState } from 'react';
import Button from '../Button/Button';
import Event from '../Event/Event';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function SocietyPage() {
  const { id } = useParams();
  const [society, setSociety] = useState<Society | null>(null);
  const [events, setEvents] = useState<ReactNode[] | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      const events = await fetch(
        `http://localhost:5180/society/events?id=${id}`
      );
      return await events.json();
    };

    const getSociety = async () => {
      const soc = await fetch(`http://localhost:5180/society?id=${id}`);
      if (soc.ok) {
        const json = await soc.json();
        setSociety(json);
        const events = await getEvents();
        if (
          events.message ===
          'The society does not have any events, or none exist within the provided filters.'
        ) {
          setEvents([]);
        } else {
          setEvents(events);
        }
      } else {
        console.log('Failed to fetch society');
      }
    };

    getSociety();
  }, []);

  const joinEvent = async (eventId: string) => {
    const res = await fetch('http://localhost:5180/user/event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ eventId }),
    });
    if (res.ok) {
      alert('Joined event yippee');
    }
  };

  if (!id) {
    return <>No society provided.</>;
  }

  return (
    society && (
      <div className={classes.container}>
        <section
          className={
            society.profilePicture
              ? classes.picture
              : classes.defaultPictureContainer
          }
          style={{
            backgroundImage: `url(${society.profilePicture})`,
            backgroundPositionY: '0px',
          }}
        >
          {!society.profilePicture && (
            <UserGroupIcon className={classes.defaultPicture} />
          )}
        </section>
        <section>
          <header className={classes.header}>
            <h1>{society.name}</h1>
            <p>{society.description}</p>
          </header>
          <main className={classes.main}>
            <section>
              {events && events.length > 0 ? (
                <>
                  <h2>Events</h2>
                  <ul className={classes.events}>
                    {events.map((event: any) => (
                      <li key={event.id}>
                        {/* <Button
                          type="button"
                          onClick={() => {
                            joinEvent(event.id);
                          }}
                        >
                          Join
                        </Button> */}
                        <Event
                          name={event.name}
                          time={`${event.startDateTime} - ${event.endDateTime}`}
                          image={
                            'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fa%2Fa5%2FRed_Kitten_01.jpg&f=1&nofb=1&ipt=cd2acb0971452c69a7ba55acb246385f6c734a9f844da1dad74dd7d7736d5cfb&ipo=images'
                          }
                          backgroundPositionY="0px"
                        ></Event>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No events yet sadge</p>
              )}
            </section>
            <section>
              <h2>Keywords</h2>
            </section>
          </main>
        </section>
      </div>
    )
  );
}
