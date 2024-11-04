import './App.css';
import Event from './Event/Event';
import NavBar from './NavBar/NavBar';
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
      <NavBar
        profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"
      ></NavBar>
    </>
  );
}

export default App;