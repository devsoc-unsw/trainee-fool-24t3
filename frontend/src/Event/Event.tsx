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
      <h1>{props.name}</h1>
      <h2>{props.time}</h2>
      {props.keywords && (
        <section>
          <h2>Keywords</h2>
          {props.keywords?.map((keyword) => (
            <p>{keyword}</p>
          ))}
        </section>
      )}
    </div>
  );
}

export default Event;
