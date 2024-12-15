import { useParams } from "react-router";
import classes from "./SocietyPage.module.css";
import { Society } from "../UserContext/UserContext";
import { ReactNode, useEffect, useState } from "react";
import Button from "../Button/Button";

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
          "The society does not have any events, or none exist within the provided filters."
        ) {
          setEvents([]);
        } else {
          setEvents(events);
        }
      } else {
        console.log("Failed to fetch society");
      }
    };

    getSociety();
  }, []);

  const joinEvent = async (eventId: string) => {
    const res = await fetch("http://localhost:5180/user/event/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ eventId }),
    });
    const json = await res.json();
    if (res.ok) {
      alert("Joined event yippee");
    }
    console.log(json);
  };

  if (!id) {
    return <>No society provided.</>;
  }

  return (
    society && (
      <div className={classes.container}>
        <div
          className={classes.picture}
          style={{
            backgroundImage: `url(${society.profilePicture})`,
            backgroundPositionY: "0px",
          }}
        />
        <h1>{society.name}</h1>
        {events && events.length > 0 ? (
          <ul>
            {events.map((event: any) => (
              <li key={event.id}>
                {event.name}{" "}
                <Button
                  type="button"
                  onClick={() => {
                    joinEvent(event.id);
                  }}
                >
                  Join
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events yet sadge</p>
        )}
      </div>
    )
  );
}
