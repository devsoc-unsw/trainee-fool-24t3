import classes from './CalendarWeekdayCell.module.css';

type WeekdayCellProps = {
    day?: string
};

function CalendarWeekdayCell(props: WeekdayCellProps) {
  return (
    <div className={classes.weekdayCellWrapper}>
        <p className={classes.weekday}>{props.day}</p>
    </div>
  )
}

export default CalendarWeekdayCell