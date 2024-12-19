import { getDb } from '../../config/db';
import { Keyword } from '../Keyword/keyword';
import { Society } from '../Society/society';

const db = getDb();

export interface SocietyEvent {
  id?: number;
  image: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  societies: Society;
  keywords: Keyword;
}
