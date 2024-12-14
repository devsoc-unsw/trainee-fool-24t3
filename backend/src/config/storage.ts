import { StorageClient } from "@supabase/storage-js";
import { decode } from 'base64-arraybuffer';

const STORAGE_URL = process.env["STORAGE_URL"];
const SERVICE_KEY = process.env["SERVICE_ROLE"];

if(!STORAGE_URL) {
    throw new Error("Storage URL not found.");
}
if(!SERVICE_KEY) {
    throw new Error("Service key not found.");
}
const storageClient = new StorageClient(STORAGE_URL, {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
});

export const uploadFile = async (file: string, fileType: string, societyId: number, eventName: string) => {
    const { data, error } = await storageClient.from('images')
    .upload(`${societyId}/${eventName}/banner.${fileType.split("/")[1]}`, decode(file), {
        contentType: fileType,
        upsert: true,
    });
    if(error) {
        throw new Error(error.message);
    }
    console.log(data);
    return data.path;
};

export const getFile = async (path: string) => {
    const { data, error } = await storageClient.from('images').download(path);
    if(error) {
        throw new Error(error.message);
    }

    return data;
}