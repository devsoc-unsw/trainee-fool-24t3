import classes from "./TimelineTitle.module.css";
import { TimelineInfo } from "../../../../backend/src/interfaces";

const startDate = new Date(2024, 9, 28);
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 5);

const dayMonthOption = { day: "numeric", month: "numeric" };
const weekdayOption = { weekday: "long" };

const getDate = function (date: Date, options: {}): string {
  return date.toLocaleDateString("en-GB", options);
};

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

export function TimelineTitle(TimelineTitleProps: TimelineInfo) {
  const { startDate } = TimelineTitleProps;

  return (
    <header className={classes.timelineTitle}>
      <h1 className={classes.weekTitle}>Week 8</h1>
      <h2 className={classes.dateRange}>{`${getDate(
        startDate,
        dayMonthOption
      )} - ${getDate(endDate, dayMonthOption)}`}</h2>
    </header>
  );
}
