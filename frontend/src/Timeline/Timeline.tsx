import classes from "./timeline.module.css";
import { DayInfo, TimelineInfo } from "../../../backend/src/interfaces";
import { Calendar } from "../Calendar/Calendar";
import { useSearchParams } from "react-router";
import { TimelineDay } from "./TimelineDay/TimelineDay";
import { TimelineTitle } from "./TimelineTitle/TimelineTitle";
import { TimelineBar } from "./TimelineBar/TimelineBar";

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

export function TimelinePage() {
  const [searchParams] = useSearchParams();

  const currentTimeline: TimelineInfo = {
    startDate,
    days,
  };

  // Replace object above with function to retrieve timeline.

  return (
    <main>
      {searchParams.get(`view`) ? (
        <Calendar></Calendar>
      ) : (
        <div className={classes.timelinePageContainer}>
          {TimelineTitle(currentTimeline)}

          {currentTimeline.days.map((day: DayInfo) => TimelineDay(day))}

          {TimelineBar(currentTimeline)}
        </div>
      )}
    </main>
  );
}
