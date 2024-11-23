import classes from './timeline.module.css';
import Event from './Event/Event';
import {
  DayInfo, 
  TimelineInfo
} from '../../backend/src/interfaces';

const startDate = new Date(2024, 9, 28);
const endDate = new Date(2024, 10, 1);

function Day(dayProps: DayInfo) {

  return (
    <div className={classes.container}>
      {
        dayProps.events.map((event) => Event(event))
      }
    </div>
  );
}

function Timeline() {
  
  const currentTimeline: TimelineInfo = {
    startDate,
    endDate,
    days: []
  };
  // Replace object above with function to retrieve timeline.

  return (
    <div className={classes.container}>
      {
        currentTimeline.days.map((day: DayInfo) => Day(day))
      }
      <p>This is the preliminary version of the timeline.</p>
      <p>It currently has no data because I couldn't be bothered,</p>
      <p>So the text here is paragraph tags placed manually</p>
      <p>To show that the div appears and exists at least</p>
    </div>
  );
}




export default Timeline;