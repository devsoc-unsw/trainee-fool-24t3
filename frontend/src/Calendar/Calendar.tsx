import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, getDaysInMonth } from 'date-fns'
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import classes from './Calendar.module.css'
import CalendarCell from '../CalendarCell/CalendarCell'
import CalendarDayName from '../CalendarDayName/CalendarDayName'

function Calendar() {
    const mapDayIndex = (dayIndex:number) => {
        return (dayIndex === 0 ? 6 : dayIndex - 1);
    }
    
    const addMonth = (currentDate:Date) => {
        setCurrentDate(addMonths(currentDate, 1));
    }

    const subMonth = (currentDate:Date) => {
        console.log(subMonth);
        setCurrentDate(subMonths(currentDate, 1));
    }
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const daysOfMonth = eachDayOfInterval({
        start: firstDay,
        end: lastDay
    });
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const startDayIndex = mapDayIndex(getDay(firstDay));
    const dayBuffer = (42-(getDaysInMonth(currentDate)+startDayIndex));
    //const [eventsInMonth, setEventsInMonth] = useState([]);

    return (
        <div className={classes.container}>
            <div className={classes.calendar}>
                <header className={classes.calendarHeader}>
                    <h1 className={classes.monthYearName}>{format(currentDate, "MMMM yyyy")}</h1>
                    <div className={classes.calendarNavButtons}>
                        <ArrowLeftIcon className={classes.navButton} onClick={() => subMonth(currentDate)}/>
                        <ArrowRightIcon className={classes.navButton} onClick={() => addMonth(currentDate)}/>
                    </div>
                </header>
                <main>
                    <div className={classes.weekdayRow}>
                        { days.map((day) => {
                            return <CalendarDayName day={day}/>
                        })}
                    </div>
                    <div className={classes.days}>
                        {Array.from({length:startDayIndex}).map((_, ) => {
                            return <CalendarCell/>
                        })}

                        { daysOfMonth.map((day) => {
                            return <CalendarCell date={format(day, 'dd/MM')}/>
                        })}

                        {Array.from({length:dayBuffer}).map((_, ) => {
                            return <CalendarCell/>
                        })}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Calendar