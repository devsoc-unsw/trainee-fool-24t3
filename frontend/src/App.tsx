import "./App.css";
import NavBar from "./NavBar/NavBar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import HomePage from "./HomePage/HomePage";
import AboutPage from "./About/About";
import Calendar from "./Calendar/Calendar";
import LoginPage from "./Login/Login";
import RegisterPage from "./Register/Register";
import { Settings } from "./Settings/Settings";
import { ProfilePage } from "./Settings/SettingsPage/ProfilePage/ProfilePage";
import { EventManagementPage } from "./Settings/SettingsPage/EventManagementPage/EventManagementPage";
import { CreateNewEventPage } from "./Settings/SettingsPage/EventManagementPage/CreateNewEvent/CreateNewEvent";
import { DiscordPage } from "./Settings/SettingsPage/DiscordPage/DiscordPage";
import { Unauthenticated } from "./Unauthenticated/Unauthenticated";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute";
import { createContext, useEffect } from "react";

function App() {
  const LoginContext = createContext(null);

  useEffect(() => {
    fetch("http://localhost:5180/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
        });
      } else {
        res.json().then((data) => {
          console.log(data);
        });
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/timeline" element={<Calendar />} /> //
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/settings"
            element={
              // this propagates to all child routes
              <ProtectedRoute
                isAuthenticated={false}
                fallback={<Navigate to="/login" />}
              >
                <Settings />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<ProfilePage />} />
            <Route path="events" element={<EventManagementPage />} />
            <Route path="events/new" element={<CreateNewEventPage />} />
            <Route path="discord" element={<DiscordPage />} />
          </Route>
          <Route path="/unauthenticated" element={<Unauthenticated />} />
        </Routes>
      </div>
      <NavBar profileImage="https://i.redd.it/white-pharaoh-in-school-textbook-v0-fgr8oliazlkd1.jpg?width=225&format=pjpg&auto=webp&s=04dc4c2c8a0170c4e161091673352cd966591475"></NavBar>
    </BrowserRouter>
  );
}

export default App;
