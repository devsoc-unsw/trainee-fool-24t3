import classes from './CalendarCell.module.css';

type CalendarCellProps = {
  date?: string
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