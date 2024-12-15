import { StorageClient } from '@supabase/storage-js';
import { decode } from 'base64-arraybuffer';

const STORAGE_URL = process.env['STORAGE_URL'];
const SERVICE_KEY = process.env['SERVICE_ROLE'];

if (process.env['NODE_ENV'] !== 'test' && !STORAGE_URL) {
  throw new Error('Storage URL not found.');
}
if (process.env['NODE_ENV'] !== 'test' && !SERVICE_KEY) {
  throw new Error('Service key not found.');
}

export let storageClient: StorageClient | null = null;
if (STORAGE_URL && SERVICE_KEY) {
  storageClient = new StorageClient(STORAGE_URL, {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  });
}

export const uploadFile = async (
  file: string,
  fileType: string,
  societyId: number,
  eventName: string
) => {
  if (!storageClient) {
    throw new Error('Storage client not initialised.');
  }
  const { data, error } = await storageClient
    .from('images')
    .upload(
      `${societyId}/${eventName}/banner.${fileType.split('/')[1]}`,
      decode(file),
      {
        contentType: fileType,
        upsert: true,
      }
    );
  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  return (await getFileUrl(data.path)).publicUrl;
};

export const getFile = async (path: string) => {
  if (!storageClient) {
    throw new Error('Storage client not initialised.');
  }
  const { data, error } = await storageClient.from('images').download(path);
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getFileUrl = async (path: string) => {
  if (!storageClient) {
    throw new Error('Storage client not initialised.');
  }

  const { data } = storageClient.from('images').getPublicUrl(path);

  return data;
};
