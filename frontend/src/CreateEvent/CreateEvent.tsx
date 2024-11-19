import classes from "./CreateEvent.module.css";
import Button, { ButtonOptions } from "../Button/Button";
import { CameraIcon } from "@heroicons/react/24/outline";
import BackButton from "../BackButton/BackButton";

function CreateEvent() {
  return (
    <div className={classes.container}>
      <BackButton></BackButton>
      <div className={classes.main}>
        <header className={classes.header}>
          <h1>Create new event</h1>
          <Button
            type={ButtonOptions.Plus}
            className={classes.plusIcon}
          ></Button>
        </header>
        <form>
          <div className={classes.photo}>
            <CameraIcon className={classes.cameraIcon}></CameraIcon>
            <p>Upload photo here...</p>
          </div>
          <label className={classes.field}>Event name</label>
          <div className={classes.textInput}>Training Program Induction</div>
          <label className={classes.field}>Event location</label>
          <div className={classes.textInput}>John Lions Garden</div>
          <div className={classes.times}>
            <div className={classes.timeInput}>
              <label className={classes.field}>Date</label>
              <div className={classes.textInput}>6/5/24</div>
            </div>
            <div className={classes.timeInput}>
              <label className={classes.field}>Start time</label>
              <div className={classes.textInput}>11:00AM</div>
            </div>
            <div className={classes.timeInput}>
              <label className={classes.field}>End time</label>
              <div className={classes.textInput}>5:00PM</div>
            </div>
          </div>
          <label className={classes.field}>Description</label>
          <div className={`${classes.textInput} ${classes.description}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            elementum pulvinar cursus. Duis vel convallis orci. Duis blandit
            ultrices hendrerit. Morbi ullamcorper vehicula arcu, et suscipit ex
            posuere quis. Sed turpis massa, placerat ut sem
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
