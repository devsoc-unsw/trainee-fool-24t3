import "./App.css";
import { AuthScreen } from "./AuthScreen/AuthScreen";
import Event from "./Event/Event";
import { Keyword, KeywordOptions } from "./Keyword/Keyword";
import bbq from "./assets/bbq.png";
import { TextInput } from "./TextInput/TextInput";
import { AtSymbolIcon } from "@heroicons/react/24/solid";

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
        heading="Login"
        text={<p>The quick brown fox jumped over the lazy dog</p>}
        inputs={[
          <TextInput
            icon={<AtSymbolIcon />}
            placeholder="Email"
            name="email"
          />,
          <TextInput placeholder="Password" name="password" />,
        ]}
        buttonText="Sign Up"
        footer={<p>stone</p>}
      ></AuthScreen>
    </>
  );
}

export default App;
