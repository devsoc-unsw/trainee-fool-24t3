import classes from "./EventDetails.module.css";
import Button from "../Button/Button";
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Keyword from "../Keyword/Keyword";
import ShareButton from "../ShareButton/ShareButton";
import { ButtonIcons, ButtonVariants } from "../Button/ButtonTypes";

type EventDetailsProps = {
  image: string;
  backgroundPositionY: string;
  name: string;
  society: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationUrl?: string;
  attending: number;
  description: string;
  keywords?: string[];
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
      ></div>

      <div className={classes.info}>
        <div className={classes.details}>
          <h1 className={classes.name}>{props.name}</h1>
          <div className={classes.detail}>
            <UserIcon className={classes.icon}></UserIcon>
            <p className={classes.detailInfo}>{props.society}</p>
          </div>
          <div className={classes.detail}>
            <CalendarIcon className={classes.icon}></CalendarIcon>
            <p className={classes.detailInfo}>{props.date}</p>
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
              <a href={`${props.locationUrl}`}>
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

          <div className={classes.actions}>
            <Button
              type={"button"}
              variant={ButtonVariants.Primary}
              icon={ButtonIcons.Bookmark}
              className={classes.actionIcon}
            ></Button>
            <ShareButton className={classes.actionIcon}></ShareButton>
          </div>
        </div>

        <div className={classes.description}>
          <p>{props.description}</p>
          {props.keywords && (
            <div className={classes.keywords}>
              {props.keywords?.map((keyword) => (
                <Keyword>{keyword}</Keyword>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
