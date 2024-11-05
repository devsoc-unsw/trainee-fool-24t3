import classes from './Keyword.module.css';
import { XMarkIcon } from '@heroicons/react/24/solid';

type KeywordProps = {
  keyword: string;
};

function Keyword(props: KeywordProps) {
  return (
    <div className={classes.keyword}>
      <div className={classes.keywordText}>{props.keyword}</div>
      <button className={classes.button}>
        <XMarkIcon className={classes.deleteButtonIcon} />
      </button>
    </div>
  );
}

export default Keyword;
