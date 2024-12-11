import classes from './timeline.module.css';
import Event from './Event/Event';
import {
  DayInfo, 
  TimelineInfo
} from '../../backend/src/interfaces';

const dayMonthOption = { day: 'numeric', month: 'numeric' };
const weekdayOption = { weekday: 'long' };

const getDate = function (date: Date, options: { }): string {
  return date.toLocaleDateString('en-GB', options);
};

const startDate = new Date(2024, 9, 28);
const endDate = new Date(2024, 10, 3);
const days = Array.from({ length: 7 }, (e, i) => {

  e = 50; //straight up this line is just here to get rid of "value declared but not read" warning. 
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

function TimelineTitle(TimelineTitleProps: TimelineInfo) {
  const { startDate, endDate } = TimelineTitleProps;

  return (
    <div className={classes.timelineTitle}>
      <p className={classes.weekTitle}>{'Week 8' /*I have no clue what to put here */}</p>
      <p className={classes.dateRange}>{`${getDate(startDate, dayMonthOption)} - ${getDate(endDate, dayMonthOption)}`}</p>
    </div>
  );
}

function TimelineBar(TimelineProps: TimelineInfo) {
  
  return (
    <div className={classes.timelineBarContainer}>
      <div className={classes.arrowContainer}><p className={classes.arrowText1}></p></div>
      <div className={classes.daysContainer}>
        { TimelineProps.days.map((day) => {
          let weekdayString = getDate(day.date, weekdayOption);
            return (
            
            <div className={classes.dayContainerBox}>
              <p className={classes.weekdayInitial}>{ weekdayString[0] }</p>
              <p className={classes.weekdayText}>{ weekdayString }</p>
              <p className={classes.dateText}>{ getDate(day.date, dayMonthOption) }</p>
            </div>
            );
          })
        } 
      </div>
      <div className={classes.arrowContainer}><p className={classes.arrowText2}></p></div>
    </div>
  );
}

function TimelinePage() {

  const currentTimeline: TimelineInfo = {
    startDate,
    endDate,
    days
  };

  // Replace object above with function to retrieve timeline.

  return (
    <div className={classes.timelinePageContainer}>
      { TimelineTitle(currentTimeline) }

      { currentTimeline.days.map((day: DayInfo) => Day(day)) }

      { TimelineBar(currentTimeline) }
    </div>
  );
}


function PCTimelinePage() {

  const currentTimeline: TimelineInfo = {
    startDate,
    endDate,
    days
  };

  // Replace object above with function to retrieve timeline.

  return (
    <div className={classes.PCTimelineContainer}>
      { TimelineTitle(currentTimeline) }

      { currentTimeline.days.map((day: DayInfo) => Day(day)) }

      { TimelineBar(currentTimeline) }
    </div>
  );
}

function MobileTimelinePage() {

  const currentTimeline: TimelineInfo = {
    startDate,
    endDate,
    days
  };

  // Replace object above with function to retrieve timeline.

  return (
    <div className={classes.mobileTimelineContainer}>
      { TimelineTitle(currentTimeline) }

      { currentTimeline.days.map((day: DayInfo) => Day(day)) }

      { TimelineBar(currentTimeline) }
    </div>
  );
}

function MobileTimelinePageFrame() {

  return (
    <div className={classes.mobileTimelineFrameContainer}>
      { MobileTimelinePage() }  
    </div>
  );
}

export { TimelinePage, PCTimelinePage, MobileTimelinePage, MobileTimelinePageFrame };