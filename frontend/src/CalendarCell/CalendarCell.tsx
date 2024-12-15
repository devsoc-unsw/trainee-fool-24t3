import classes from './CalendarCell.module.css';
import CalendarEventElem from '../CalendarEventElem/CalendarEventElem';
interface Event {
  startDateTime: Date;
  [key: string]: any; 
};

type CalendarCellProps = {
  date?: string,
  events?: Event[]
  [key: string]: any; //gonna fix this and fill it out with whatever the backend sends soon
};

function CalendarCell(props: CalendarCellProps) {
  return (
    <div className={classes.calendarCellWrapper}>
        <div className={classes.calendarCellHeader}>
            <p className={classes.dateElement}>{props.date ? props.date : ''}</p>
        </div>
        <div className={classes.eventSpace}>
          {
            props.events ? props.events.map((event) => {
              return <CalendarEventElem event={event}/>
            }) : ''
          }
        </div>
    </div>
  )
}

export default CalendarCell