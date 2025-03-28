import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import NotificationsPage from "./pages/NotificationsPage";

// import dis from './assets/dis_3.gif';
import alert from "./assets/alert.png";
import DetailPage from "./pages/DetailPage";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-gray-50"
        style={{
          backgroundImage: `url(${alert})`,
          backgroundSize: "cover", // Ensures it scales to fit the screen
          backgroundRepeat: "no-repeat", // Prevents the GIF from repeating
          backgroundPosition: "center", // Centers the GIF properly
        }}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports/:reportId" element={<DetailPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
