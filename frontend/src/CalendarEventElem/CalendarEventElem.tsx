import classes from './CalendarEventElement.module.css';
import { format } from 'date-fns'
type CalendarEventElemProps = {
    eventId?: number 
    eventTitle: string
    eventStartDate: Date
}

function CalendarEventElem(props: CalendarEventElemProps) {
  return (
    <div className={classes.CalEventElemWrapper}>
        <p className={classes.title}>{props.eventTitle}</p>
        <p className={classes.startTime}>{format(props.eventStartDate, 'ha')}</p>
    </div>
  )
}

export default CalendarEventElem