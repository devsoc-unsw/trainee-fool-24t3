import React from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import classes from './Calendar.module.css'
import CalendarCell from '../CalendarCell/CalendarCell'
function Calendar() {
  return (
    <div className={classes.calendarPage}>
        <div className={classes.calendarHeader}>
            <h1>Current Month</h1>
            <div className={classes.calendarNavButtons}>
                <ArrowLeftIcon/>
                <ArrowRightIcon/>
            </div>
            <div>
                <CalendarCell date="01/11"/>
            </div>
        </div>
    </div>
  )
}

export default Calendar