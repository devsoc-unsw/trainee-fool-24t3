import { CameraIcon } from '@heroicons/react/24/outline';
import Button from '../../../../Button/Button';
import { SettingsPage } from '../../SettingsPage';
import classes from './CreateNewEvent.module.css';
import { ButtonIcons, ButtonVariants } from '../../../../Button/ButtonTypes';
import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserContext } from '../../../../UserContext/UserContext';
import { TextInput, TextOptions } from '../../../../TextInput/TextInput';
import { useNavigate } from 'react-router';

type StringSetter = React.Dispatch<React.SetStateAction<string>>;

enum ErrorMessage {
  TYPE = 'Banner must be an image file.',
  NUMBER = 'Please upload only one image.',
  SIZE = 'Maximum file size of 10MB.',
  default = '',
}

interface UploadError {
  status: boolean;
  message: ErrorMessage;
}

const updateError = (newMessage: ErrorMessage) => {
  return {
    status: newMessage !== ErrorMessage.default,
    message: newMessage,
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface FormStructure {
  societyId: number | undefined;
  image?: File | Base64Image;
  name: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  description: string;
}

interface Base64Image {
  buffer: string;
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}

export function CreateNewEventPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<UploadError>({
    status: false,
    message: ErrorMessage.default,
  });
  const [submitError, setSubmitError] = useState('');
  const [fileDragging, setFileDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inactiveForms, setInactiveForms] = useState<FormStructure[]>([]);
  const { society } = useContext(UserContext);
  const navigate = useNavigate();

  const defaultForm = {
    societyId: society?.id,
    name: 'Training Program Induction',
    location: 'John Lions Garden',
    startDateTime: new Date(),
    endDateTime: new Date(Date.now() + 60 * 60 * 1000), // one hour by default
    description: 'Your event description.',
  };

  const [formContent, setFormContent] = useState<FormStructure>(defaultForm);

  const uploadBanner = (files: File[]) => {
    if (files.length <= 1) {
      if (files.length === 1) {
        const file = files[0];
        if (file.type.split('/')[0] !== 'image') {
          setUploadError(updateError(ErrorMessage.TYPE));
          return;
        }
        if (file.size > 1000000 * 10) {
          setUploadError(updateError(ErrorMessage.SIZE));
          return;
        }
        setUploadError(updateError(ErrorMessage.default));
        setFormContent({ ...formContent, image: file });
        return;
      }
      setFormContent({ ...formContent, image: undefined });
    } else {
      setUploadError(updateError(ErrorMessage.NUMBER));
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setFileDragging(false);

    const droppedItems = e.dataTransfer.files;
    if (droppedItems) {
      uploadBanner([...droppedItems]);
    }
  };

  const handleDropzoneClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (inputRef?.current) {
      inputRef.current.click();
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    var files = e.target.files;
    if (files) {
      uploadBanner([...files]);
    }
  };

  const handleDropzoneDragOver: React.DragEventHandler<HTMLDivElement> = (
    e
  ) => {
    e.preventDefault();
    setFileDragging(true);
  };

  const handleDropzoneDragEnd: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setFileDragging(false);
  };

  const removeFile: MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();
    setFormContent({ ...formContent, image: undefined });
  };

  const submitForm = async () => {
    let formResponses = formContent;
    if (formContent.image && formContent.image instanceof File) {
      const file = formContent.image;
      const buffer = await fileToBase64(file);
      const data = {
        buffer,
        metadata: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
      };
      formResponses = { ...formContent, image: data };
    }

    setSubmitting(true);
    const res = await fetch('http://localhost:5180/event', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formResponses),
    });
    const json = await res.json();

    setSubmitting(false);
    if (res.ok) {
      emptyForm();
      navigate('/settings/events', { state: { creationSuccess: true } });
    } else {
      setSubmitError(json.message);
    }
  };

  const emptyForm = () => {
    setFormContent(defaultForm);
  };

  const setFormItem = (itemKey: keyof FormStructure) => {
    const getUpdatedDateTime = (val: string, newDateTime: Date) => {
      //check if time
      const times = val.split(':');
      if (times.length === 1) {
        //must be date
        const [year, month, day] = val.split('-').map(Number);
        newDateTime.setFullYear(year, month, day);
      } else {
        const [hour, minute] = times.map(Number);
        newDateTime.setHours(hour, minute);
      }
      return newDateTime;
    };

    const setItemContent: StringSetter = (val) => {
      if (typeof val === 'string') {
        if (formContent[itemKey] instanceof Date) {
          const newDateTime = getUpdatedDateTime(val, formContent[itemKey]);
          setFormContent({ ...formContent, [itemKey]: newDateTime });
          return;
        }
        setFormContent({ ...formContent, [itemKey]: val });
      } else {
        setFormContent((prev) => {
          const item = prev[itemKey];
          let newVal;
          if (item instanceof Date) {
            // assumes val ouputs in appropriate Date/Time format
            const newDateTime = val(item.toString());
            newVal = getUpdatedDateTime(newDateTime, item);
          } else {
            newVal = val(prev[itemKey] as string);
          }
          return { ...prev, [itemKey]: newVal };
        });
      }
    };
    return setItemContent;
  };

  useEffect(() => {
    if (!formContent.societyId) {
      setFormContent({ ...formContent, societyId: society?.id });
      return;
    }
    if (society?.id !== formContent.societyId) {
      setInactiveForms((prev) => [
        ...prev.filter((item) => item.societyId !== formContent.societyId),
        formContent,
      ]);
      const archived = inactiveForms.find(
        (form) => form.societyId === society?.id
      );
      if (archived) {
        setFormContent(archived);
        return;
      }
    }
    setFormContent({ ...defaultForm, societyId: society?.id });
  }, [society]);

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
        {submitError && (
          <div className={classes.error}>
            <p>{submitError}</p>
          </div>
        )}
        {submitting && (
          <div className={classes.submitting}>
            <p>creating event...</p>
          </div>
        )}
        <div className={classes.photoArea}>
          <div
            className={`${classes.photo} ${
              fileDragging ? classes.photoDragged : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDropzoneDragOver}
            onDragEnd={handleDropzoneDragEnd}
            onDragLeave={handleDropzoneDragEnd}
            onClick={handleDropzoneClick}
          >
            <CameraIcon className={classes.cameraIcon}></CameraIcon>
            <p>Upload photo here...</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          {uploadError.status && (
            <div>
              <p className={classes.error}>{uploadError.message}</p>
            </div>
          )}
          {formContent.image instanceof File && (
            <div>
              <img
                className={classes.thumbnail}
                onClick={removeFile}
                src={URL.createObjectURL(formContent.image)}
              />
              <p className={classes.fileName}>{formContent.image.name}</p>
            </div>
          )}
        </div>
        <label className={classes.field}>Event name</label>
        <TextInput
          className={classes.textInput}
          placeholder={defaultForm.name}
          name="event name"
          onChange={setFormItem('name')}
          type={TextOptions.Text}
          error={false}
          autofocus={true}
          value={formContent.name === defaultForm.name ? '' : formContent.name}
        />
        <label className={classes.field}>Event location</label>
        <TextInput
          className={classes.textInput}
          placeholder={defaultForm.location}
          name="event location"
          onChange={setFormItem('location')}
          type={TextOptions.Text}
          error={false}
          value={
            formContent.location === defaultForm.location
              ? ''
              : formContent.location
          }
        />
        <div className={classes.times}>
          <div className={classes.timeInput}>
            <label className={classes.field}>Date</label>
            <TextInput
              className={classes.textInput}
              placeholder="DD/MM/YYY"
              value={formContent.endDateTime.toLocaleDateString('en-CA')}
              name="event date"
              onChange={setFormItem('endDateTime')}
              type={TextOptions.Date}
              error={submitError.includes('Invalid date')}
            />
          </div>
          <div className={classes.timeInput}>
            <label className={classes.field}>Start time</label>
            <TextInput
              className={classes.textInput}
              placeholder="HH:MM"
              value={formContent.startDateTime
                .toLocaleTimeString('en-GB')
                .slice(0, 5)}
              name="event start time"
              onChange={setFormItem('startDateTime')}
              type={TextOptions.Time}
              error={submitError.includes('Invalid date')}
            />
          </div>
          <div className={classes.timeInput}>
            <label className={classes.field}>End time</label>
            <TextInput
              className={classes.textInput}
              placeholder="HH:MM"
              value={formContent.endDateTime
                .toLocaleTimeString('en-GB')
                .slice(0, 5)}
              name="event end time"
              onChange={setFormItem('endDateTime')}
              type={TextOptions.Time}
              error={submitError.includes('Invalid date')}
            />
          </div>
        </div>
        <label className={classes.field}>Description</label>
        <TextInput
          className={`${classes.textInput} ${classes.description}`}
          placeholder={defaultForm.description}
          name="event description"
          onChange={setFormItem('description')}
          type={TextOptions.Text}
          error={false}
          textarea={true}
          value={
            formContent.description === defaultForm.description
              ? ''
              : formContent.description
          }
        />
      </form>
    </SettingsPage>
  );
}
