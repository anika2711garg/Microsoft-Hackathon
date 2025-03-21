import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import dis from './assets/dis_3.gif';

function App() {
  return (
    <Router>
      <div
  className="min-h-screen bg-gray-50"
  style={{
 
    backgroundImage: `url(${dis})`,
    backgroundSize: 'cover',      // Ensures it scales to fit the screen
    backgroundRepeat: 'no-repeat', // Prevents the GIF from repeating
    backgroundPosition: 'center'   // Centers the GIF properly
  }}
>

        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;