import classes from './Society.module.css';

type SocietyProps = {
  name: string;
  image: string;
  //These parameters can be passed as props otherwise some fault value maybe(?)
  backgroundPositionY?: string;
  color?: string;
};

function Society(props: SocietyProps) {
  return (
    <div className={classes.container}>
      <div
        className={classes.picture}
        style={{
          backgroundImage: `url(${props.image})`,
          backgroundPositionY: props.backgroundPositionY,
        }}
      />
      <div
        className={classes.socNameDiv}
        style={{ backgroundColor: props.color ? props.color : 'red' }}
      >
        <h1 className={classes.socName}>{props.name}</h1>
      </div>
    </div>
  );
}

export default Society;
