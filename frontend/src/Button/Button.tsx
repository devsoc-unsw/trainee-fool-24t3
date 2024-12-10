import { PlusIcon } from '@heroicons/react/24/solid';
import classes from './Button.module.css';
import {
  BookmarkIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { ButtonIcons, ButtonVariants } from './ButtonTypes';

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
      className={`${classes.button} ${
        props.variant ? classes[props.variant] : ''
      } ${props.className ? props.className : ''}`}
      type={props.type}
    >
      {props.icon === ButtonIcons.Plus && (
        <PlusIcon className={classes.icon}></PlusIcon>
      )}
      {props.icon === ButtonIcons.Bookmark && (
        <BookmarkIcon className={classes.icon}></BookmarkIcon>
      )}
      {props.icon === ButtonIcons.Search && (
        <MagnifyingGlassIcon className={classes.icon}></MagnifyingGlassIcon>
      )}
      {props.icon === ButtonIcons.Back && (
        <ChevronLeftIcon className={classes.icon}></ChevronLeftIcon>
      )}
      {props.children && (
        <span className={classes.string}>{props.children}</span>
      )}
    </button>
  );
}

export default Button;
