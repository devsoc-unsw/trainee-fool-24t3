import "./App.css";
import NavBar from "./NavBar/NavBar";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./HomePage/HomePage";
import AboutPage from "./About/About";
import LoginPage from "./Login/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
      <NavBar profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"></NavBar>
    </BrowserRouter>
  );
}

export default App;
