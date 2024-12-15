import classes from './Event.module.css';

type EventProps = {
  image: string;
  backgroundPositionY: string;
  name: string;
  time: string;
  keywords?: string[];
};

function Event(props: EventProps) {
  return (
    <div className={classes.container}>
      <div
        className={classes.picture}
        style={{
          backgroundImage: `url(${props.image})`,
          backgroundPositionY: props.backgroundPositionY,
        }}
      ></div>
      <section className={classes.eventBody}>
        <h1>{props.name}</h1>
        <p>{props.time}</p>
        {props.keywords && (
          <section>
            <h2>Keywords</h2>
            {props.keywords?.map((keyword) => (
              <p>{keyword}</p>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}

export default Event;
