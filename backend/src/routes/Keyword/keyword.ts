import { getDb } from "../../config/db";
import { Attendee } from "../Attendee/attendee";
import { SocietyEvent } from "../SocietyEvent/society-event";

const db = getDb();

export interface Keyword {
    id?: number,
    text: string,
    attendees: Attendee[],
    events: SocietyEvent[]
}

