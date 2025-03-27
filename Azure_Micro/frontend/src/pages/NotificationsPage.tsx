import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const NotificationList = () => {
    interface Notification {
        id: string;
        disasterType: string;
        location: string;
        description: string;
        reporterName: string;
        timestamp: string;
        status: string;
    }

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const fetchNotifications = async () => {
      try {
          const response = await fetch("http://localhost:7071/api/getNotifications");
          if (!response.ok) throw new Error("Failed to fetch notifications");
          
          const data = await response.json();
          console.log("notifications are",data);
          // Ensure the data is an array
          return Array.isArray(data.notifications) ? data.notifications : [];
      } catch (error) {
          console.error("Error fetching notifications:", error);
          return [];
      }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
        const data = await fetchNotifications();
        console.log("data before setting state:", data);
        setNotifications(Array.isArray(data) ? data : []);
        console.log("notifications state after setting:", notifications); // This will not immediately reflect the updated state
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
}, []);

useEffect(() => {
    console.log("notifications updated state:", notifications);
}, [notifications]); // Log when state updates


    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-lg font-semibold mb-4">Sent Notifications</h2>
            <div className="space-y-4">
                
                {notifications.map((alert) => (
                    <div key={alert.id} className="border-l-4 border-blue-500 p-4 bg-gray-800 text-white rounded-lg">
                        <p className="font-medium">{alert.disasterType} at {alert.location}</p>
                        <p className="text-sm text-gray-300">{alert.description}</p>
                        <p className="text-sm text-gray-400">Reported by: {alert.reporterName}</p>
                        <p className="text-sm text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                        {alert.status === "sent" ? (
                            <CheckCircle className="text-green-400 mt-2" size={20} />
                        ) : (
                            <XCircle className="text-red-400 mt-2" size={20} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationList;