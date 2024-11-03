import { getDb } from "../../config/db";
import { Attendee } from "../Attendee/attendee";
import { SocietyEvent } from "../SocietyEvent/society-event";

const db = getDb();

export interface Society {
    id?: number,
    name: string,
    picture: string,
    events: SocietyEvent[],
    members: Attendee[],
    discordId: string
}

