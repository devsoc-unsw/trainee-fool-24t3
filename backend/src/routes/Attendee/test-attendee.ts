import { Attendee } from "./attendee";
import { newAttendee } from "./new-attendee";
import { getAttendeeFromID } from "./get-attendee";

async function main() {
  const attendee1: Attendee = {
    name: "tim drake",
    picture: "www.google.com",
    keywords: [],
    societies: [],
  };

  const res1 = await newAttendee(attendee1);

  const res2 = await getAttendeeFromID(res1.id);
}

main();
