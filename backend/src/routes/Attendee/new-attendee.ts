import { getDb } from "../../config/db";
import { Attendee } from "./attendee";

const db = getDb();

export const newAttendee = async (newAttendee: Attendee) => {
    const createdAttendee = await db.attendee.create( {
        data: {
            name: newAttendee.name,
        }
    } );

    return createdAttendee;
}