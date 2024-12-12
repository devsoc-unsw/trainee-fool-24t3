import classes from './CalendarDayName.module.css';

type DayNameProps = {
    day: string
};

function CalendarDayName(props: DayNameProps) {
  return (
    <div className={classes.weekdayCellWrapper}>
        <p className={classes.weekday}>{props.day}</p>
    </div>
  )
}

export default CalendarDayName