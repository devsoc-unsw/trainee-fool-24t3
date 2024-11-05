import './App.css';
import Event from './Event/Event';
import Keyword from './Keyword/Keyword';
import bbq from './assets/bbq.png';

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
        keywords={['hiii', 'another keyword']}
      ></Event>
      <Keyword keyword="Frunk Dwindleward"></Keyword>
      <Keyword keyword="Frunk"></Keyword>
      <Keyword keyword="Frunk Deteriossssss wfiuhdihabd auhfiuhwi dkhihaiuhf auhfihai fiuahfiuhi fiuahifuha iuahiudhi aiufhiuahfiu aifhh"></Keyword>
      <Keyword keyword="Frunk Deteriossssss wfiuhdihabd auhfiuhwi dkhihaiuhf auhfihai fiuahfiuhi fiuahifuha iuahiudhi aiufhiuahfiu aifhh"></Keyword>
      <Keyword keyword="Frunk Deteriossssss wfiuhdihabd auhfiuhwi dkhihaiuhf auhfihai fiuahfiuhi fiuahifuha iuahiudhi aiufhiuahfiu aifhh"></Keyword>
    </>
  );
}

export default App;
