import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  getDaysInMonth,
  getTime,
  startOfDay,
} from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import classes from "./Calendar.module.css";
import CalendarCell from "../CalendarCell/CalendarCell";
import CalendarDayName from "../CalendarDayName/CalendarDayName";
interface Event {
  startDateTime: Date;
  [key: string]: any;
}

function Calendar() {
  const mapDayIndex = (dayIndex: number) => {
    return dayIndex === 0 ? 6 : dayIndex - 1;
  };

  const addMonth = (currentDate: Date) => {
    setCurrentDate(addMonths(currentDate, 1));
    fetchEvents();
  };

  const subMonth = (currentDate: Date) => {
    setCurrentDate(subMonths(currentDate, 1));
    fetchEvents();
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const daysOfMonth = eachDayOfInterval({
    start: firstDay,
    end: lastDay,
  });
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const startDayIndex = mapDayIndex(getDay(firstDay));
  const dayBuffer = 42 - (getDaysInMonth(currentDate) + startDayIndex);

  const getEventsInMonth = async (firstDay: Date, lastDay: Date) => {
    const params = new URLSearchParams({
      after: format(firstDay, "yyyy-MM-dd"),
      before: format(lastDay, "yyyy-MM-dd"),
    });

    try {
      //not gonna use user/events for now as idk if login is working with the frontedn
      const res = await fetch(`http://localhost:5180/user/events?${params}`, {
        method: "GET",
        credentials: "include",
      });

      console.log(res);

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const [eventsInMonth, setEventsInMonth] = useState([]);
  const [eventsByDate, setEventsByDate] = useState<Record<number, Event[]>>({});

  const fetchEvents = async () => {
    const events = await getEventsInMonth(firstDay, lastDay);
    setEventsInMonth(events);
  };

  const buildEventsDict = async (events: Event[]) => {
    const dict: Record<number, any> = {};
    events.forEach((item: Event) => {
      const date = getTime(startOfDay(item.startDateTime));
      if (!dict[date]) {
        dict[date] = [];
      }
      dict[date].push(item);
    });
    setEventsByDate(dict);
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  useEffect(() => {
    buildEventsDict(eventsInMonth);
  }, [eventsInMonth]);

  console.log(eventsInMonth);
  console.log(eventsByDate);
  return (
    <div className={classes.container}>
      <div className={classes.calendar}>
        <header className={classes.calendarHeader}>
          <h1 className={classes.monthYearName}>
            {format(currentDate, "MMMM yyyy")}
          </h1>
          <div className={classes.calendarNavButtons}>
            <ArrowLeftIcon
              className={classes.navButton}
              onClick={() => subMonth(currentDate)}
            />
            <ArrowRightIcon
              className={classes.navButton}
              onClick={() => addMonth(currentDate)}
            />
          </div>
        </header>
        <main>
          <div className={classes.weekdayRow}>
            {days.map((day) => {
              return <CalendarDayName day={day} />;
            })}
          </div>
          <div className={classes.days}>
            {Array.from({ length: startDayIndex }).map((_) => {
              return <CalendarCell />;
            })}

            {daysOfMonth.map((day) => {
              return (
                <CalendarCell
                  date={format(day, "dd/MM")}
                  events={eventsByDate[getTime(startOfDay(day))]}
                />
              );
            })}

            {Array.from({ length: dayBuffer }).map((_) => {
              return <CalendarCell />;
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Calendar;
