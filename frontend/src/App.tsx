import "./App.css";
import Event from "./Event/Event";
import { Keyword, KeywordOptions } from "./Keyword/Keyword";
import bbq from "./assets/bbq.png";
import NavBar from "./NavBar/NavBar";
import Button, { ButtonOptions } from "./Button/Button";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./HomePage/HomePage";

function App() {
  return (
    <>
      <div className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <NavBar profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"></NavBar>
    </>
  );
}

export default App;
