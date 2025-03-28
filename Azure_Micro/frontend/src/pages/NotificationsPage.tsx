import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Mail, MapPin, Bell, User } from "lucide-react";

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
            console.log("Notifications are:", data);
            return Array.isArray(data.notifications) ? data.notifications : [];
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchNotifications();
            console.log("Data before setting state:", data);
            setNotifications(Array.isArray(data) ? data : []);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log("Notifications updated state:", notifications);
    }, [notifications]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center mb-6">
                <Bell className="mr-2" /> Sent Notifications
            </h2>

            <div className="space-y-6">
                {notifications.length > 0 ? (
                    notifications.map((alert) => (
                        <div
                            key={alert.id}
                            className="border-l-4 border-blue-500 p-5 bg-gray-800 rounded-lg shadow-md transition transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold text-blue-300 flex items-center">
                                    <MapPin className="mr-2 text-yellow-400" /> {alert.disasterType} at {alert.location}
                                </p>
                                {alert.status === "sent" ? (
                                    <CheckCircle className="text-green-400 animate-pulse" size={24} />
                                ) : (
                                    <XCircle className="text-red-400" size={24} />
                                )}
                            </div>

                            <p className="text-sm text-gray-300 mt-2">{alert.description}</p>
                            <p className="text-sm text-gray-400 flex items-center mt-1">
                                <User className="mr-2 text-purple-400" /> Reported by: {alert.reporterName}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                🕒 {new Date(alert.timestamp).toLocaleString()}
                            </p>

                            {/* Email Notification Message */}
                            <p className="mt-4 text-sm text-gray-300 flex items-center bg-gray-700 p-3 rounded-lg shadow">
                                <Mail className="mr-2 text-yellow-400" /> Email notification sent to the <span className="text-yellow-300 font-bold mx-1">{alert.disasterType}</span> department.
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No notifications sent yet.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationList;
