import sharp from 'sharp';
import ColorThief from 'colorthief';

const colorthief = new ColorThief();

const b64ToHTMLImage = (buffer: string, mimetype: string) => {
  const img = new Image();
  img.src = `data:${mimetype};base64,${buffer}`;
  return img;
};

export const compressImage = async (buffer: string, width: number) => {
  return await sharp().resize(width).jpeg({ mozjpeg: true }).toBuffer();
};

export const getColoursFromImage = async (buffer: string) => {};
