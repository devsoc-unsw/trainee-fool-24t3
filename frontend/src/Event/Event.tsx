import { useEffect, useState } from 'react';
import classes from './Event.module.css';
import ColorThief, { RGBColor } from 'colorthief';

export interface EventType {
  id: number;
  banner: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  societyId: number;
  keywords: string[];
}

export interface EventFromDatabase {
  id: number;
  banner: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  societyId: number;
  keywords: string[];
}

const colorThief = new ColorThief();

export function Event(props: EventType) {
  const [dominantColour, setDominantColour] = useState<RGBColor | null>(null);

  const getDominantColour = async (img: HTMLImageElement) => {
    const colour = await colorThief.getColor(img);
    if (colour) {
      setDominantColour(colour);
    } else {
      return null;
    }
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = props.banner;
    img.addEventListener('load', () => {
      getDominantColour(img);
    });
  }, [props.banner]);

  function formatDate(date: Date) {
    return date.toLocaleString('default', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div
      className={classes.container}
      style={
        {
          '--dominant-colour': dominantColour
            ? `rgba(${dominantColour}, 0.5)`
            : '',
        } as React.CSSProperties
      }
    >
      <div
        className={classes.picture}
        style={{
          backgroundImage: `url(${props.banner})`,
          backgroundPositionY: 0,
        }}
      ></div>
      <section className={classes.eventBody}>
        <p>
          <strong>{props.name}</strong>
        </p>
        <p>
          {formatDate(props.startDateTime)} -{' '}
          <span>{formatDate(props.endDateTime)}</span>
        </p>
        {props.keywords && (
          <section>
            <h2>Keywords</h2>
            {props.keywords?.map((keyword) => (
              <p>{keyword}</p>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}

export default Event;
