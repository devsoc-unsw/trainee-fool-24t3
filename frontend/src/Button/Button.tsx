import { PlusIcon } from '@heroicons/react/24/solid';
import classes from './Button.module.css';
import { BookmarkIcon } from '@heroicons/react/24/outline';

export enum ButtonIcons {
  Plus = 'plus',
  Bookmark = 'bookmark',
}

export enum ButtonVariants {
  Primary = 'primary',
  Secondary = 'secondary',
}

type ButtonProps = {
  children?: string;
  icon?: ButtonIcons;
  variant?: ButtonVariants;
  className?: string;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

function Button(props: ButtonProps) {
  return (
    <button
      className={
        props.variant
          ? `${classes.button} ${classes[props.variant]}`
          : classes.button
      }
      type={props.type}
    >
      {props.icon === ButtonIcons.Plus && (
        <PlusIcon
          className={`${classes.icon} ${
            props.className ? props.className : ''
          }`}
        ></PlusIcon>
      )}

      {props.icon === ButtonIcons.Bookmark && (
        <BookmarkIcon
          className={`${classes.icon} ${
            props.className ? props.className : ''
          }`}
        ></BookmarkIcon>
      )}

      {props.children && (
        <span
          className={`${classes.string} ${
            props.className ? props.className : ''
          }`}
        >
          {props.children}
        </span>
      )}
    </button>
  );
}

export default Button;
