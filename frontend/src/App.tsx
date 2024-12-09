import "./App.css";
import NavBar from "./NavBar/NavBar";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./HomePage/HomePage";
import AboutPage from "./About/About";
import EventDetails from "./EventDetails/EventDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
      <EventDetails
        image="https://pbs.twimg.com/media/F2y8Ehbb0AA-ch9.jpg"
        backgroundPositionY="-400px"
        name="TikTok rizz party"
        society="RizzSoc"
        date="25th Dec 2024"
        startTime="11am"
        endTime="3pm"
        location="florida"
        locationUrl="https://g.co/kgs/XpHCNMC"
        attending={1}
        description="According to all known laws of aviation there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway"
        keywords={[
          "rizz",
          "florida",
          "hello",
          "world",
          "tiktok now",
          ":longEmoteName:",
        ]}
      ></EventDetails>
      <NavBar profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"></NavBar>
    </BrowserRouter>
  );
}

export default App;
