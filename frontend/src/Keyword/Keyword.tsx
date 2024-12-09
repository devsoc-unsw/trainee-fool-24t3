import classes from "./Keyword.module.css";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

export enum KeywordOptions {
  Delete,
  Add,
  None,
}

type KeywordProps = {
  children: string;
  type: KeywordOptions;
};

export function Keyword(props: KeywordProps) {
  return (
    <div
      className={
        `${props.type === KeywordOptions.Delete && classes.DeleteKeyword}
        ${props.type === KeywordOptions.Add && classes.AddKeyword}
        ${props.type === KeywordOptions.None && classes.NoneKeyword}`
      }
    >
      <div className={classes.keywordText}>{props.children}</div>
      {props.type !== KeywordOptions.None && <button className={classes.button}>
        {props.type === KeywordOptions.Delete && (
          <XMarkIcon className={classes.deleteButtonIcon} />
        )}
        {props.type === KeywordOptions.Add && (
          <PlusIcon className={classes.deleteButtonIcon} />
        )}
      </button>}
    </div>
  );
}
