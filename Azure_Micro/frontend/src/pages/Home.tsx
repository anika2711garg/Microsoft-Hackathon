import { Link } from "react-router-dom";
import { AlertTriangle, MapPin, Shield, PhoneCall, Bell, FileText } from "lucide-react";
import logo from "../assets/logo-transparent-2.png";

const Home = () => {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <header className="text-center py-16 bg-blue-800">
          <img
            src={logo}
            alt="Disaster Management Logo"
            className="mx-auto h-64"
          />
          <p className="text-lg text-gray-200 mt-4">
            Real-time alerts, reports & emergency responses.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              to="/HomePage"
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              Report an Incident
            </Link>
            <Link
              to="/notifications"
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              View Alerts
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
              <AlertTriangle size={40} className="text-yellow-400 mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Instant Alerts</h3>
              <p className="text-gray-400 mt-2">
                Get real-time disaster alerts to stay informed.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
              <FileText size={40} className="text-blue-400 mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Report Incidents</h3>
              <p className="text-gray-400 mt-2">
                Easily report disasters & provide vital information.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
              <Shield size={40} className="text-green-400 mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Emergency Response</h3>
              <p className="text-gray-400 mt-2">
                Connect with emergency services instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-gray-800 py-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Emergency Contacts
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 text-center">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <PhoneCall size={30} className="text-red-400 mx-auto" />
              <h3 className="text-lg font-semibold mt-3">National Emergency</h3>
              <p className="text-yellow-300 font-bold text-lg">112</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <MapPin size={30} className="text-blue-400 mx-auto" />
              <h3 className="text-lg font-semibold mt-3">Disaster Response</h3>
              <p className="text-green-300 font-bold text-lg">
                +1 800-123-4567
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 bg-gray-900 text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Disaster Management System | All
            Rights Reserved
          </p>
        </footer>
      </div>
    );
};

export default Home;
