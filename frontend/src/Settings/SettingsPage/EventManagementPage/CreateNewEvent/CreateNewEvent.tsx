import { CameraIcon } from '@heroicons/react/24/outline';
import Button from '../../../../Button/Button';
import { SettingsPage } from '../../SettingsPage';
import classes from './CreateNewEvent.module.css';
import { ButtonIcons, ButtonVariants } from '../../../../Button/ButtonTypes';
import { useRef, useState } from 'react';

enum ErrorMessage {
    TYPE = "Banner must be an image file.",
    NUMBER = "Please upload only one image.",
    default = "",
};

interface UploadError {
  status: boolean,
  message: ErrorMessage,
};

const updateError = (newMessage: ErrorMessage) => {
  return {
    status: newMessage !== ErrorMessage.default,
    message: newMessage
  }
};

interface FormStructure {
  id: number,
  banner?: File,
  name: string,
  location: string,
  startDateTime: Date,
  endDateTime: Date,
  description: string,
};

const defaultForm = {
  id: 0,
  name: "", 
  location: "", 
  startDateTime: new Date(),
  endDateTime: new Date(), 
  description: ""
};

export function CreateNewEventPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<UploadError>({status: false, message: ErrorMessage.default});
  const [formContent, setFormContent] = useState<FormStructure>(defaultForm);
  const [fileDragging, setFileDragging] = useState(false);

  const uploadBanner = (files: File[]) => {
    if(files.length <= 1) {
      if(files.length === 1) {
        const file = files[0];
        if(file.type.split("/")[0] !== "image") {
         setUploadError(updateError(ErrorMessage.TYPE)); 
         return;
        }
        setUploadError(updateError(ErrorMessage.default));
        setFormContent({...formContent, banner: file});
        return;
      }
      setFormContent({...formContent, banner: undefined});
    } else {
      setUploadError(updateError(ErrorMessage.NUMBER));
    }
  }

  const handleDrop = (e: any) => {
    e.preventDefault();
    setFileDragging(false);
    
    const droppedItems = e.dataTransfer.files;
    console.log(e.dataTransfer);
    uploadBanner(droppedItems);
  }
  
  const handleDropzoneClick = (e: any) => {
    e.preventDefault();
    if(inputRef?.current) {
      inputRef.current.click();
    }
  }

  const handleInputChange = (e: any) => {
    var files = e.target.files;
    uploadBanner(files);
  }

  const handleDropzoneDragOver = (e: any) => {
    e.preventDefault();
    setFileDragging(true);
  }

  const handleDropzoneDragEnd = (e: any) => {
    e.preventDefault();
    setFileDragging(false);
  }

  const removeFile = (e: any) => {
    e.preventDefault();
    setFormContent({...formContent, banner: undefined});
  }

  const submitForm = async (e: any) => {
    e.preventDefault();
    
    console.log(formContent);

    const res = await fetch("/http://localhost:5180/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formContent)
    });
  }

  return (
    <SettingsPage
      title="Create a new event"
      pageAbovePath="/settings/events"
      headerButtons={[
        <Button
          variant={ButtonVariants.Primary}
          icon={ButtonIcons.Plus}
          type="button"
          onClick={submitForm}
        />,
      ]}
    >
      <form>
        <div className={classes.photoArea}>
          <div className={`${classes.photo} ${fileDragging ? classes.photoDragged : ""}`} 
            onDrop={handleDrop} 
            onDragOver={handleDropzoneDragOver} 
            onDragEnd={handleDropzoneDragEnd}
            onDragLeave={handleDropzoneDragEnd}
            onClick={handleDropzoneClick}
          >
            <CameraIcon className={classes.cameraIcon}></CameraIcon>
            <p>Upload photo here...</p>
          </div>    
          <input ref={inputRef} type="file" accept="image/*" style={{display: 'none'}} onChange={handleInputChange}/> 
          {uploadError.status && 
            <div>
              <p className={classes.error}>{uploadError.message}</p>
            </div>}   
          {formContent.banner && 
            <div>
              <img className={classes.thumbnail} onClick={removeFile} src={URL.createObjectURL(formContent.banner)}/>
              <p className={classes.fileName}>{formContent.banner.name}</p>
            </div>}
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
    </SettingsPage>
  );
}
