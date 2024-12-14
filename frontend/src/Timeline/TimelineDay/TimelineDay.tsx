import classes from "./TimelineDay.module.css";
import { DayInfo } from "../../../../backend/src/interfaces";
import Event from "../../Event/Event";

export function TimelineDay(dayProps: DayInfo) {
  return <div>{dayProps.events.map((event) => Event(event))}</div>;
}
