import classes from "./Keyword.module.css";

type KeywordProps = {
  keyword: string;
  deleteButton: string;
};

function Keyword(props: KeywordProps) {
  return (
    <div className={classes.container}>
      <div className={classes.keywordText}>{props.keyword}</div>
      <button className={classes.buttonContainer}>
        <img src={props.deleteButton} className={classes.deleteButton}></img>
      </button>
    </div>
  );
}

export default Keyword;
