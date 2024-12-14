import classes from './CalendarEventElement.module.css';
import { format } from 'date-fns'

interface Event {
  startDateTime: Date;
  [key: string]: any; 
};

type CalendarEventElemProps = {
    event: Event
}

function CalendarEventElem(props: CalendarEventElemProps) {
  console.log(props.event)
  return (
    <div className={classes.CalEventElemWrapper}>
        <p className={classes.title}>{props.event.name}</p>
        <p className={classes.startTime}>{format(props.event.startDateTime, 'ha')}</p>
    </div>
  )
}

export default CalendarEventElem