import classes from './CalendarCell.module.css';

type CalendarCellProps = {
  date?: string
};

function CalendarCell(props: CalendarCellProps) {
  return (
    <div className={classes.calendarCellWrapper}>
        <div className={classes.calendarCellHeader}>
            <h1 className={classes.dateElement}>{props.date ? props.date : ''}</h1>
        </div>
        <div className={classes.eventSpace}>

        </div>
    </div>
  )
}

export default CalendarCell