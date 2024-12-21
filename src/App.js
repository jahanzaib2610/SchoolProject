import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./SchoolProject/Login";
import Signup from "./SchoolProject/Signup";
import Dashboard from "./SchoolProject/Dashboard";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check sessionStorage when the app mounts to initialize login state
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    setIsLoggedIn(!!loggedInUser);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // Update state when user logs in
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser"); // Clear session
    setIsLoggedIn(false); // Update state when user logs out
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
