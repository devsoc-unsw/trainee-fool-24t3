import classes from './CalendarEventElement.module.css';
import EventDetails from '../EventDetails/EventDetails';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { format } from 'date-fns'

interface Event {
  startDateTime: Date;
  [key: string]: any; 
};

type CalendarEventElemProps = {
    event: Event
}

function CalendarEventElem(props: CalendarEventElemProps) {
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const containerDOM = document.querySelector(`.${classes.container}`)

  const showEventDetails = () => {
    setEventDetailsOpen(true);
  }
  const closeEventDetails = () => setEventDetailsOpen(false);

  return (
    <div className={classes.CalEventElemWrapper} onClick={showEventDetails}>
        <p className={classes.title}>{props.event.name}</p>
        <p className={classes.startTime}>{format(props.event.startDateTime, 'ha')}</p>

        {
        containerDOM && eventDetailsOpen && ReactDOM.createPortal(
          <EventDetails image={props.event.image} backgroundPositionY={props.event.backgroundPositionY} name={props.event.name}
            society={props.event.society} eventDate={format(props.event.startDateTime, 'dd-MM-yyyy')} startTime={format(props.event.startDateTime, 'ha')}
            endTime={format(props.event.endDateTime, 'ha')} location={props.event.location} attending={0} description={props.event.description} closeEventDetails={closeEventDetails}/>, containerDOM
        )}
    </div>
  )
}

export default CalendarEventElem