import classes from './Keyword.module.css';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { KeywordOptions } from './KeywordTypes';

type KeywordProps = {
  children: string;
  type: KeywordOptions;
};

export function Keyword(props: KeywordProps) {
  return (
    <div
      className={
        props.type === KeywordOptions.Delete
          ? classes.DeleteKeyword
          : classes.AddKeyword
      }
    >
      <div className={classes.keywordText}>{props.children}</div>
      <button className={classes.button}>
        {props.type === KeywordOptions.Delete && (
          <XMarkIcon className={classes.deleteButtonIcon} />
        )}
        {props.type === KeywordOptions.Add && (
          <PlusIcon className={classes.deleteButtonIcon} />
        )}
      </button>
    </div>
  );
}
