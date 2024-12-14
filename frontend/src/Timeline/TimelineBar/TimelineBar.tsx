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

export function TimelineBar(TimelineProps: TimelineInfo) {
  return (
    <div className={classes.timelineBarContainer}>
      <div className={classes.arrowContainer}>
        <ArrowLeftIcon className={classes.arrow} />
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
        <ArrowRightIcon className={classes.arrow} />
      </div>
    </div>
  );
}
