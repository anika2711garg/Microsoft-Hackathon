import { useEffect, useState } from 'react';
import { Bell, Settings, CheckCircle, XCircle } from 'lucide-react';

// Mock Azure API Simulation
const fetchNotifications = async () => {
  return [
    {
      id: 1,
      title: 'Fire Alert - Downtown',
      status: 'success',
      message: 'Sent to Fire Department',
      time: '2 minutes ago'
    },
    {
      id: 2,
      title: 'Flood Warning - Riverside',
      status: 'failed',
      message: 'Failed to send',
      time: '15 minutes ago'
    }
  ];
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState<{ id: number; title: string; status: string; message: string; time: string }[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen p-8 flex flex-col"
      style={{ backgroundImage: `url('/your-background-image.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Notifications & Alerts</h1>
        <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-all">
          <Settings size={20} />
          <span>Alert Settings</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Alerts Section */}
        <div className="bg-black/60 p-6 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
            <Bell className="mr-2" size={24} />
            Recent Alerts
          </h2>

          <div className="space-y-4">
            {notifications.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 pl-4 py-2 ${
                  alert.status === 'success' ? 'border-green-400' : 'border-red-400'
                } text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-300">{alert.message}</p>
                  </div>
                  {alert.status === 'success' ? (
                    <CheckCircle className="text-green-400" size={20} />
                  ) : (
                    <XCircle className="text-red-400" size={20} />
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{alert.time}</p>
                {alert.status === 'failed' && (
                  <button className="text-sm text-yellow-400 hover:text-yellow-500 mt-1">
                    Retry Sending
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alert Configuration Section */}
        <div className="bg-black/60 p-6 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Alert Configuration</h2>

          <div className="space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emergency Services Notifications</p>
                <p className="text-sm text-gray-300">Send alerts to local emergency services</p>
              </div>
              <input type="checkbox" checked className="toggle-checkbox" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-300">Send SMS alerts to registered numbers</p>
              </div>
              <input type="checkbox" checked className="toggle-checkbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
