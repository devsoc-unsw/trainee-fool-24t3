import classes from './timeline.module.css';
import Event from './Event/Event';
import {
  DayInfo, 
  TimelineInfo
} from '../../backend/src/interfaces';

const startDate = new Date(2024, 9, 28);
const endDate = new Date(2024, 10, 1);
const days = Array.from({ length: 7 }, (e, i) => {

  e = 0; //straight up this line is just here to get rid of "value declared but not read" warning. 
  // it was bugging me

  const date: Date = new Date(startDate.valueOf());

  date.setDate(startDate.getDate() + i);

  return {
    date,
    events: []
  };
});

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
    days
  };

  // Replace object above with function to retrieve timeline.
  const getDate = function (day: DayInfo, options: { }): string {
    return day.date.toLocaleDateString('en-GB', options);
  }
  return (
    <div className={classes.container}>
      {
        currentTimeline.days.map((day: DayInfo) => Day(day))
      }
     <div className={classes.timelineBar}>
       <div className={classes.arrowContainer}><p className={classes.arrowTextLeft}>&larr;</p></div>
       <div className={classes.daysContainer}>
       {currentTimeline.days.map((day) => (
        <div className={classes.dayContainerBox}>
          <p className={classes.weekdayText}>{ getDate(day, { weekday: 'long' }) }</p>
          <p className={classes.dateText}>{ getDate(day, { day: 'numeric', month: 'numeric' }) }</p>
        </div>
       ))} 
       </div>
       <div className={classes.arrowContainer}><p className={classes.arrowTextRight}>&rarr;</p></div>
     </div>
   </div>
  );
}

export default Timeline;