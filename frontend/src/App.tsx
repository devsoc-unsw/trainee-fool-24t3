import "./App.css";
import NavBar from "./NavBar/NavBar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import HomePage from "./HomePage/HomePage";
import AboutPage from "./About/About";
import LoginPage from "./Login/Login";
import RegisterPage from "./Register/Register";
import VerifyOTP from "./VerifyOTP/VerifyOTP";
import GenerateOTP from "./GenerateOTP/GenerateOTP";
import { Settings } from "./Settings/Settings";
import { ProfilePage } from "./Settings/SettingsPage/ProfilePage/ProfilePage";
import { EventManagementPage } from "./Settings/SettingsPage/EventManagementPage/EventManagementPage";
import { CreateNewEventPage } from "./Settings/SettingsPage/EventManagementPage/CreateNewEvent/CreateNewEvent";
import { DiscordPage } from "./Settings/SettingsPage/DiscordPage/DiscordPage";
import { Unauthenticated } from "./Unauthenticated/Unauthenticated";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute";
import { useEffect, useState } from "react";
import { User, UserContext } from "./UserContext/UserContext";
import { TimelinePage } from "./Timeline/Timeline";

function App() {
  const [user, setUser] = useState<User | null>(null);

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
          setUser(data);
        });
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="page">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/generateotp" element={<GenerateOTP />} />
            <Route path="/verifyotp" element={<VerifyOTP />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  isAuthenticated={user === null}
                  fallback={<Navigate to="/settings/profile" />}
                >
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute
                  isAuthenticated={user === null}
                  fallback={<Navigate to="/settings/profile" />}
                >
                  <RegisterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                // this propagates to all child routes
                <ProtectedRoute
                  isAuthenticated={user !== null && user.id !== undefined}
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
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
