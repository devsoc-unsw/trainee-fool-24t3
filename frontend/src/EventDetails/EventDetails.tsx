import classes from "./EventDetails.module.css";
import Button, { ButtonOptions } from "../Button/Button";
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Keyword, KeywordOptions } from "../Keyword/Keyword";

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
          <h1>{props.name}</h1>
          <div className={classes.detail}>
            <UserIcon></UserIcon>
            <p className={classes.detailInfo}>{props.society}</p>
          </div>
          <div className={classes.detail}>
            <CalendarIcon></CalendarIcon>
            <p className={classes.detailInfo}>{props.date}</p>
          </div>
          <div className={classes.detail}>
            <ClockIcon></ClockIcon>
            <p
              className={classes.detailInfo}
            >{`${props.startTime} - ${props.endTime}`}</p>
          </div>
          <div className={classes.detail}>
            <MapPinIcon></MapPinIcon>
            <p className={classes.detailInfo}>{props.location}</p>
            {props.locationUrl && (
              <a href={`url(${props.locationUrl})`}>
                <ArrowTopRightOnSquareIcon></ArrowTopRightOnSquareIcon>
              </a>
            )}
          </div>
          <div className={classes.detail}>
            <CheckIcon></CheckIcon>
            <p className={classes.detailInfo}>{props.attending} attending</p>
          </div>

          <div className={classes.actions}>
            <Button type={ButtonOptions.Bookmark}></Button>
            <ShareIcon></ShareIcon>
          </div>
        </div>

        <div className={classes.description}>
          <p>{props.description}</p>
          {props.keywords && (
            <div className={classes.keywords}>
              {props.keywords?.map((keyword) => (
                <Keyword type={KeywordOptions.Add}>{keyword}</Keyword>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
