import "./App.css";
import { AuthScreen } from "./AuthScreen/AuthScreen";
import Event from "./Event/Event";
import { Keyword, KeywordOptions } from "./Keyword/Keyword";
import bbq from "./assets/bbq.png";
import { TextInput } from "./TextInput/TextInput";
import { LockClosedIcon, AtSymbolIcon } from "@heroicons/react/24/outline";
import NavBar from "./NavBar/NavBar";
import Button, { ButtonOptions } from "./Button/Button";
import CreateEvent from "./CreateEvent/CreateEvent";

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
      <AuthScreen
        heading="Log in"
        text={<p>The quick brown fox jumped over the lazy dog</p>}
        inputs={[
          <TextInput
            icon={<AtSymbolIcon />}
            placeholder="Email"
            name="email"
          />,
          <TextInput
            icon={<LockClosedIcon />}
            placeholder="Password"
            name="password"
          />,
        ]}
        buttonText="Sign Up"
        footer={<p>stone</p>}
      ></AuthScreen>
      <Button type="button" variant={ButtonOptions.Plus}></Button>
      <Button type="button" variant={ButtonOptions.Bookmark}></Button>
      <Button type="button" variant={ButtonOptions.String}>
        Log in
      </Button>
      <CreateEvent></CreateEvent>
      <NavBar profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"></NavBar>
    </>
  );
}

export default App;
