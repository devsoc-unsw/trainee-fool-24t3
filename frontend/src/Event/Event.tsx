import { useEffect, useState } from 'react';
import classes from './Event.module.css';
import ColorThief, { RGBColor } from 'colorthief';

export interface EventType {
  id: number;
  image: string;
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
  image: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  societyId: number;
  keywords: string[];
}

const colorThief = new ColorThief();

const hueFromRGB = (rgb: RGBColor) => {
  let hue;
};

const rgbToHSL = (rgb: RGBColor) => {
  const hue = hueFromRGB(rgb);
};

export function Event(props: EventType) {
  const [backgroundColour, setBackgroundColor] = useState<RGBColor | null>(
    null
  );
  const [textColour, setTextColour] = useState<RGBColor | null>(null);
  const [dominantColour, setDominantColour] = useState<RGBColor | null>(null);

  const getPalette = async (img: HTMLImageElement) => {
    const palette = await colorThief.getPalette(img);
    if (palette) {
      setDominantColour(palette[0]);
      setBackgroundColor(palette[4]);
      setTextColour([255, 255, 255]);
    } else {
      return null;
    }
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = props.image;
    img.addEventListener('load', () => {
      getPalette(img);
    });
  }, [props.image]);

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
          '--background-colour': backgroundColour
            ? `rgba(${backgroundColour}, 1)`
            : '',
          '--text-colour': textColour ? `rgba(${textColour}, 1)` : '',
        } as React.CSSProperties
      }
    >
      <div
        className={classes.picture}
        style={{
          backgroundImage: `url(${props.image})`,
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
