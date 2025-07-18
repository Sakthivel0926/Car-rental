import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CarProvider } from './context/CarContext';
import Addcar from './components/Addcar';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './pages/HomePage';
import SavedCarsPage from './pages/SavedCarsPage';
import SettingsPage from './pages/SettingsPage';
import BottomNavigation from './components/BottomNavigation';
import HeaderNavbar from './components/HeaderNavbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleSignup = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <CarProvider>
      <Router>
        <HeaderNavbar />
        {!isLoggedIn ? (
          <Routes>
            <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} onShowSignup={() => window.location.href = "/signup"} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/saved" element={<SavedCarsPage />} />
              <Route path="/add" element={<Addcar />} />
              <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNavigation />
          </>
        )}
      </Router>
    </CarProvider>
  );
}

export default App;