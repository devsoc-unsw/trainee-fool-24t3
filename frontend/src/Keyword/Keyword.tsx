import classes from "./Keyword.module.css";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { KeywordOptions } from "./KeywordTypes";

type KeywordProps = {
  children: string;
  type?: KeywordOptions;
};

export default function Keyword(props: KeywordProps) {
  return (
    <div
      className={`${classes.keyword} ${
        props.type && props.type === KeywordOptions.Add
          ? classes.keywordAdd
          : classes.keywordDelete
      } ${!props.type && classes.keywordNone}`}
    >
      <div className={classes.keywordText}>{props.children}</div>
      {props.type && (
        <button className={classes.button}>
          {props.type === KeywordOptions.Add ? (
            <PlusIcon className={`${classes.addButtonIcon} ${classes.icon}`} />
          ) : (
            <XMarkIcon className={`${classes.deleteButtonIcon} ${classes.icon}`} />
          )}
        </button>
      )}
    </div>
  );
}
