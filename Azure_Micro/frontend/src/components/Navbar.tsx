import { NavLink } from 'react-router-dom';
import { AlertTriangle, Map, LayoutDashboard, Bell } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-green-900 via-purple-700 to-pink-600 shadow-lg border-b-2 border-yellow-400">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2 font-bold text-xl text-white drop-shadow-lg">
            <AlertTriangle className="text-yellow-300 animate-pulse" />
            <span>Disaster Reporter</span>
          </NavLink>

          <div className="flex space-x-6">
            {[
              { to: "/", icon: AlertTriangle, text: "Report" },
              { to: "/map", icon: Map, text: "Map" },
              { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
              { to: "/notifications", icon: Bell, text: "Notifications" },
            ].map(({ to, icon: Icon, text }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-400 text-gray-900 shadow-md'
                      : 'text-white hover:bg-yellow-300 hover:text-gray-900 hover:shadow-lg'
                  }`
                }
              >
                <Icon size={20} />
                <span>{text}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
