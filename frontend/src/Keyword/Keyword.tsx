import classes from "./Keyword.module.css";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { KeywordOptions } from "./KeywordTypes";

type KeywordProps = {
  children: string;
  type: KeywordOptions;
};

export default function Keyword(props: KeywordProps) {
  return (
    <div
      className={`${classes.keyword} ${
        props.type === KeywordOptions.Delete && classes.DeleteKeyword
      }
        ${props.type === KeywordOptions.Add && classes.AddKeyword}
        ${props.type === KeywordOptions.None && classes.NoneKeyword}`}
    >
      <div className={classes.keywordText}>{props.children}</div>
      {props.type !== KeywordOptions.None && (
        <button className={classes.button}>
          {props.type === KeywordOptions.Delete && (
            <XMarkIcon
              className={`${classes.deleteButtonIcon} ${classes.icon}`}
            />
          )}
          {props.type === KeywordOptions.Add && (
            <PlusIcon
              className={`${classes.deleteButtonIcon} ${classes.icon}`}
            />
          )}
        </button>
      )}
    </div>
  );
}
