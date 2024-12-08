import {useState} from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import classes from './Calendar.module.css'
import CalendarCell from '../CalendarCell/CalendarCell'
import CalendarWeekdayCell from '../CalendarWeekdayCell/CalendarWeekdayCell'

const mapDayIndex = (dayIndex:number) => {
    return (dayIndex === 0 ? 6 : dayIndex - 1);
}

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const daysOfMonth = eachDayOfInterval({
        start: firstDay,
        end: lastDay
    })
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const startDayIndex = mapDayIndex(getDay(firstDay));

  return (
    <div className={classes.calendarPage}>
        <div className={classes.calendarHeader}>
            <h1>{format(currentDate, "MMMM yyyy")}</h1>
            <div className={classes.calendarNavButtons}>
                <ArrowLeftIcon className={classes.navButton}/>
                <ArrowRightIcon className={classes.navButton}/>
            </div>
        </div>
        <div className={classes.calendarElem}>
            <div className={classes.weekdayRow}>
                { days.map((day) => {
                    return <CalendarWeekdayCell day={day}/>
                })}
            </div>
            <div className={classes.days}>
            
                {Array.from({length:startDayIndex}).map((_, index) => {
                    return <CalendarCell/>
                })}

                { daysOfMonth.map((day) => {
                    return <CalendarCell date={format(day, 'dd/MM')}/>
                })}
            </div>
        </div>
    </div>
  )
}

export default Calendar