import classes from "./EventDetails.module.css";
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

type EventDetailsProps = {
  image: string;
  backgroundPositionY: string;
  name: string;
  society: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationUrl?: string;
  attending: number;
  description: string;
  keywords?: string[];
  closeEventDetails: () => void
};

function EventDetails(props: EventDetailsProps) {
  return (
    <div className={classes.container}>
      <div
        className={classes.picture}
        style={{
          backgroundImage: `url(${props.image})`,
          backgroundPositionY: props.backgroundPositionY,
        }}
      >
        <Button
          type={"button"}
          icon={ButtonIcons.Cross}
          variant={ButtonVariants.Primary}
          className={classes.exitIcon}
          onClick={props.closeEventDetails}
        ></Button>
      </div>

      <div className={classes.info}>
        <section className={classes.details}>
          <header className={classes.name}>{props.name}</header>
          <div className={classes.detail}>
            <UserIcon className={classes.icon}></UserIcon>
            <p className={classes.detailInfo}>{props.society}</p>
          </div>
          <div className={classes.detail}>
            <CalendarIcon className={classes.icon}></CalendarIcon>
            <p className={classes.detailInfo}>{props.eventDate}</p>
          </div>
          <div className={classes.detail}>
            <ClockIcon className={classes.icon}></ClockIcon>
            <p
              className={classes.detailInfo}
            >{`${props.startTime} - ${props.endTime}`}</p>
          </div>
          <div className={classes.detail}>
            <MapPinIcon className={classes.icon}></MapPinIcon>
            <p className={classes.detailInfo}>{props.location}</p>
            {props.locationUrl && (
              <a href={`${props.locationUrl}`} target="_blank" rel="noopener">
                <ArrowTopRightOnSquareIcon
                  className={`${classes.icon} ${classes.locationLink}`}
                ></ArrowTopRightOnSquareIcon>
              </a>
            )}
          </div>
          <div className={`${classes.detail} ${classes.attending}`}>
            <CheckIcon className={classes.icon}></CheckIcon>
            <p className={classes.detailInfo}>{props.attending} attending</p>
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
          <main>{props.description}</main>
          {props.keywords && (
            <section className={classes.keywords}>
              {props.keywords?.map((keyword) => (
                <Keyword>{keyword}</Keyword>
              ))}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}

export default EventDetails;
