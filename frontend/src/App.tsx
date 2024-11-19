import "./App.css";
import Event from "./Event/Event";
import { Keyword, KeywordOptions } from "./Keyword/Keyword";
import bbq from "./assets/bbq.png";
import NavBar from "./NavBar/NavBar";
import Button, { ButtonOptions } from "./Button/Button";
import CreateEvent from "./CreateEvent/CreateEvent";
import EventDetails from "./EventDetails/EventDetails";

function App() {
  return (
    <>
      <h1>Hi</h1>
      <Event
        name="DevSoc BBQ"
        image={bbq}
        backgroundPositionY="180px"
        time="Tomorrow mate"
      ></Event>
      <Event
        name="TikTok rizz party"
        image="https://pbs.twimg.com/media/F2y8Ehbb0AA-ch9.jpg"
        backgroundPositionY="150px"
        time="25th Dec 2024"
        keywords={["hiii", "another keyword"]}
      ></Event>
      <Keyword type={KeywordOptions.Delete}>Frunk Dwindleward</Keyword>
      <Keyword type={KeywordOptions.Add}>Frunk Dwindleward</Keyword>
      <Keyword type={KeywordOptions.Delete}>Frunk Dwindleward</Keyword>
      <Keyword type={KeywordOptions.Delete}>Frunk Dwindleward</Keyword>
      <Keyword type={KeywordOptions.Delete}>Frunk Dwindleward</Keyword>
      <Button type={ButtonOptions.Plus}></Button>
      <Button type={ButtonOptions.Bookmark}></Button>
      <Button type={ButtonOptions.String}>Log in</Button>
      {/* <CreateEvent></CreateEvent> */}
      <EventDetails
        image="https://pbs.twimg.com/media/F2y8Ehbb0AA-ch9.jpg"
        backgroundPositionY="-400px"
        name="TikTok rizz party"
        society="RizzSoc"
        date="25th Dec 2024"
        startTime="11am"
        endTime="3pm"
        location="florida"
        locationUrl="https://www.google.com/maps?sca_esv=8d771920c62c0cac&rlz=1C1CHBF_en-GBAU886AU888&output=search&q=florida&source=lnms&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkW1DRbm01j6DCVS0r1sTxn7h_rt6mVhwDmwtd3hPZjM8zl8B526v4C-56SyLN7G5Ea4EGxGedorwsop3jjqDfEtgbxrE3Rl8OFITVEjXnG7_9mq32LUciwz4RySbr93RffVK3fp__GP9MQPfgY7PvpJnN-oWalaa3XWZfuE-7M99PadvB5QLqsVdNpULB4D_w_VjTUNQ&entry=mc&ved=1t:200715&ictx=111"
        attending={1}
        description="According to all known laws of aviation there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway"
        keywords={["rizz", "florida"]}
      ></EventDetails>
      <NavBar profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"></NavBar>
    </>
  );
}

export default App;
