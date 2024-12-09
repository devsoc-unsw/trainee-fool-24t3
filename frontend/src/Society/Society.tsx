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
          backgroundPositionY: props.backgroundPositionY
            ? props.backgroundPositionY
            : '0px',
        }}
      />
      <div
        className={classes['society-name-container']}
        style={{
          backgroundColor: props.color ? props.color : 'hsl(0, 0%, 100%)',
        }}
      >
        <h1 className={classes['society-name']}>{props.name}</h1>
      </div>
    </div>
  );
}

export default Society;
