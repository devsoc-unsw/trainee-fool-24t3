import classes from "./TimelineTitle.module.css";
import { TimelineInfo } from "../../../../backend/src/interfaces";

const startDate = new Date(2024, 9, 28);
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 5);
const dayMonthOption = { day: "numeric", month: "numeric" };

const getDate = function (date: Date, options: {}): string {
  return date.toLocaleDateString("en-GB", options);
};

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
