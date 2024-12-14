import classes from "./TimelineBar.module.css";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { TimelineInfo } from "../../../../backend/src/interfaces";

const dayMonthOption = { day: "numeric", month: "numeric" };
const weekdayOption = { weekday: "long" };

const getDate = function (date: Date, options: {}): string {
  return date.toLocaleDateString("en-GB", options);
};

const startDate = new Date(2024, 9, 28);
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 5);

const days = Array.from({ length: 7 }, (e, i) => {
  e = 50; //straight up this line is just here to get rid of "value declared but not read" warning.
  // it was bugging me

  const date: Date = new Date(startDate.valueOf());

  date.setDate(startDate.getDate() + i);

  return {
    date,
    events: [],
  };
});

export function TimelineBar(TimelineProps: TimelineInfo) {
  return (
    <div className={classes.timelineBarContainer}>
      <div className={classes.arrowContainer}>
        <ArrowLeftIcon />
      </div>
      <div className={classes.daysContainer}>
        {TimelineProps.days.map((day) => {
          let weekdayString = getDate(day.date, weekdayOption);
          return (
            <div className={classes.dayContainerBox}>
              <p className={classes.weekdayInitial}>{weekdayString[0]}</p>
              <p className={classes.weekdayText}>{weekdayString}</p>
              <p className={classes.dateText}>
                {getDate(day.date, dayMonthOption)}
              </p>
            </div>
          );
        })}
      </div>
      <div className={classes.arrowContainer}>
        <ArrowRightIcon />
      </div>
    </div>
  );
}
