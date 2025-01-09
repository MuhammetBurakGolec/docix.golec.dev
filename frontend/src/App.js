import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DockerStatus from "./pages/DockerStatus/DockerStatus";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import AddPost from "./components/AddPost/AddPost";
import Documentation from "./pages/Documentation/Documentation";
import DashBoard from "./pages/DashBoard/DashBoard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/docker-status" element={<DockerStatus />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </Router>
  );
};

export default App;