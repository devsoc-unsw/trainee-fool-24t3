import classes from "./CreateEvent.module.css";
import Button, { ButtonOptions } from "../Button/Button";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { CameraIcon } from "@heroicons/react/24/outline";

function CreateEvent() {
  return (
    <div className={classes.container}>
      <button className={classes.back}>
        <ChevronLeftIcon className={classes.chevronIcon}></ChevronLeftIcon>
      </button>
      <div className={classes.main}>
        <div className={classes.header}>
          <h1>Create new event</h1>
          <Button
            type={ButtonOptions.Plus}
            className={classes.plusIcon}
          ></Button>
        </div>
        <div className={classes.photo}>
          <CameraIcon className={classes.cameraIcon}></CameraIcon>
          <p>Upload photo here...</p>
        </div>
        <h3 className={classes.field}>Event name</h3>
        <div className={classes.textInput}>Training Program Induction</div>
        <h3 className={classes.field}>Event location</h3>
        <div className={classes.textInput}>John Lions Garden</div>
        <div className={classes.times}>
          <div className={classes.timeInput}>
            <h3 className={classes.field}>Date</h3>
            <div className={classes.textInput}>6/5/24</div>
          </div>
          <div className={classes.timeInput}>
            <h3 className={classes.field}>Start time</h3>
            <div className={classes.textInput}>11:00AM</div>
          </div>
          <div className={classes.timeInput}>
            <h3 className={classes.field}>End time</h3>
            <div className={classes.textInput}>5:00PM</div>
          </div>
        </div>
        <h3 className={classes.field}>Description</h3>
        <div className={`${classes.textInput} ${classes.description}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          elementum pulvinar cursus. Duis vel convallis orci. Duis blandit
          ultrices hendrerit. Morbi ullamcorper vehicula arcu, et suscipit ex
          posuere quis. Sed turpis massa, placerat ut sem
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
