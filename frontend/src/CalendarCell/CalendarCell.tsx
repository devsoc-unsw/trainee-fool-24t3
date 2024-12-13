import classes from './CalendarCell.module.css';
interface Event {
  startDateTime: Date;
  [key: string]: any; 
};

type CalendarCellProps = {
  date?: string,
  events?: Event[]
};

function CalendarCell(props: CalendarCellProps) {
  return (
    <div className={classes.calendarCellWrapper}>
        <div className={classes.calendarCellHeader}>
            <p className={classes.dateElement}>{props.date ? props.date : ''}</p>
        </div>
        <div className={classes.eventSpace}>
          
        </div>
    </div>
  )
}

export default CalendarCell