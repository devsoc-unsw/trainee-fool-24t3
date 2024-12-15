import classes from "./CalendarEventElement.module.css";
import { format } from "date-fns";
import { Link } from "react-router";

interface Event {
  startDateTime: Date;
  [key: string]: any;
}

type CalendarEventElemProps = {
  event: Event;
};

function CalendarEventElem(props: CalendarEventElemProps) {
  return (
    <Link to={`/event/1`} className={classes.CalEventElemWrapper}>
      <p className={classes.title}>{props.event.name}</p>
      <p className={classes.startTime}>
        {format(props.event.startDateTime, "ha")}
      </p>
    </Link>
  );
}

export default CalendarEventElem;
