import classes from "./EventPage.module.css";
import Button from "../Button/Button";
import { ButtonIcons, ButtonVariants } from "../Button/ButtonTypes";
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Keyword from "../Keyword/Keyword";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { eventID } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const getEvent = async () => {
      const response = await fetch(`http://localhost:5180/event?id=${eventID}`);
      const json = await response.json();
      setEvent(json);
    };
    getEvent();
  }, []);

  return (
    <>
      {event && (
        <div className={classes.container}>
          <div
            className={classes.picture}
            style={{
              backgroundImage: `url(${event.image})`,
              backgroundPositionY: event.backgroundPositionY,
            }}
          >
            <Button
              type={"button"}
              icon={ButtonIcons.Cross}
              variant={ButtonVariants.Primary}
              className={classes.exitIcon}
              // onClick={props.closeEventDetails}
            ></Button>
          </div>

          <div className={classes.info}>
            <section className={classes.details}>
              <header className={classes.name}>{event.name}</header>
              <div className={classes.detail}>
                <UserIcon className={classes.icon}></UserIcon>
                <p className={classes.detailInfo}>{event.society}</p>
              </div>
              <div className={classes.detail}>
                <CalendarIcon className={classes.icon}></CalendarIcon>
                <p className={classes.detailInfo}>{event.eventDate}</p>
              </div>
              <div className={classes.detail}>
                <ClockIcon className={classes.icon}></ClockIcon>
                <p
                  className={classes.detailInfo}
                >{`${event.startTime} - ${event.endTime}`}</p>
              </div>
              <div className={classes.detail}>
                <MapPinIcon className={classes.icon}></MapPinIcon>
                <p className={classes.detailInfo}>{event.location}</p>
                {event.locationUrl && (
                  <a
                    href={`${event.locationUrl}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <ArrowTopRightOnSquareIcon
                      className={`${classes.icon} ${classes.locationLink}`}
                    ></ArrowTopRightOnSquareIcon>
                  </a>
                )}
              </div>
              <div className={`${classes.detail} ${classes.attending}`}>
                <CheckIcon className={classes.icon}></CheckIcon>
                <p className={classes.detailInfo}>
                  {event.attending} attending
                </p>
              </div>

              <footer className={classes.actions}>
                <Button
                  type={"button"}
                  icon={ButtonIcons.Bookmark}
                  variant={ButtonVariants.Primary}
                  className={classes.actionIcon}
                ></Button>
                <Button
                  type={"button"}
                  icon={ButtonIcons.Share}
                  variant={ButtonVariants.Secondary}
                  className={classes.actionIcon}
                ></Button>
              </footer>
            </section>

            <section className={classes.description}>
              <main>{event.description}</main>
              {event.keywords && (
                <section className={classes.keywords}>
                  {event.keywords?.map((keyword: string) => (
                    <Keyword>{keyword}</Keyword>
                  ))}
                </section>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
