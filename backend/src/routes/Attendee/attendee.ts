import { Society } from "../Society/society";
import { Keyword } from "../Keyword/keyword";

export interface Attendee {
    id?: number,
    name: string,
    keywords?: Keyword[],
    societies?: Society[]
}