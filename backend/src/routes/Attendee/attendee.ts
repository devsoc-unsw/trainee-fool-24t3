import { Society } from "../Society/society";
import { Keyword } from "../Keyword/keyword";

export interface Attendee {
    id?: number,
    name: string,
    picture: string,
    keywords?: Keyword[],
    societies?: Society[]
}