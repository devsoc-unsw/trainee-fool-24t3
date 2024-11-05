import { getDb } from "../../config/db";
import { Attendee } from './attendee';

const db = getDb();

export const getAttendeeFromID = async (id: number): Promise<Attendee | null> => {
    const data = await db.attendee.findUnique( {
        where: {
            id: id
        }
    });

    if(!data) {
        return null;
    }

    return {
        id: data?.id,
        name: data?.name,
        picture: data?.picture
    }
}