import sharp from 'sharp';
import ColorThief, { RGBColor } from 'colorthief';

const colorthief = new ColorThief();

const bufferToImage = async (b64Buffer: string, mimetype: string) => {
  console.log(b64Buffer);
  let buffer = b64Buffer;
  const compressedBuffer = await compressImage(buffer, 200);
  const colours = await getColoursFromHTMLImage(
    b64ToHTMLImage(compressedBuffer.toString('base64'), mimetype)
  );
  console.log(colours);
};

const b64ToHTMLImage = (buffer: string, mimetype: string) => {
  const img = new Image();
  img.src = `data:${mimetype};base64,${buffer}`;
  return img;
};

export const compressImage = async (buffer: string, width: number) => {
  return await sharp().resize(width).jpeg({ mozjpeg: true }).toBuffer();
};

const rgbToHSL = (rgb: RGBColor) => {
  const [r, g, b] = rgb.map((c) => c / 255);

  if (r === undefined || g === undefined || b === undefined) {
    throw new Error('Invalid RGB value provided.');
  }

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;

  const lightness = Math.round((min + max) / 2);

  if (min === max) {
    return [0, 0, lightness];
  }

  let saturation;
  if (lightness <= 0.5) {
    saturation = delta / (max + min);
  } else {
    saturation = delta / (2 - max - min);
  }

  let hue;
  if (max === r) {
    hue = (g - b) / delta;
  } else if (max === g) {
    hue = 2 + (b - r) / delta;
  } else {
    hue = 4 + (r - g) / delta;
  }
  hue = hue * 60;
  if (hue < 0) {
    hue += 360;
  }

  return [Math.round(hue), Math.round(saturation), Math.round(lightness)];
};

export const getColoursFromHTMLImage = async (image: HTMLImageElement) => {
  const rgbs = await colorthief.getPalette(image);
  return rgbs?.map((rgb) => rgbToHSL(rgb));
};
