import { useEffect, useState, useMemo } from "react";
import { Filter, MapPin } from "lucide-react";
import AzureMap from "../components/AzureMap";

// Throttle function to limit the frequency of updates
const useThrottle = (value: string, delay: number) => {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

interface Report {
  location?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  media: {
    text: string;
    image_description?: string | null;
    audio_transcription?: string | null;
  };
  _id: string;
  severity: string;
  description: string;
  destruction_type?: string;
  timestamp: string;
}

const severityColors: Record<string, string> = {
  High: "#FF0000",
  Medium: "#FFA500",
  Low: "#00FF00",
};

function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Throttle the search query to prevent excessive updates
  const throttledSearchQuery = useThrottle(searchQuery, 300);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:3000/fetch_reports");

      if (!response.ok) {
        throw new Error("Error fetching reports");
      }

      const data = await response.json();
      console.log("Reports fetched:", data.reports);

      setReports(data.reports);
      setFilteredReports(data.reports); // Initialize filteredReports with all reports
    } catch (err: unknown) {
      setError((err as Error).message);
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Update filtered reports when the throttled search query changes
  useEffect(() => {
    if (throttledSearchQuery.trim() === "") {
      setFilteredReports(reports);
    } else {
      const lowerCaseQuery = throttledSearchQuery.toLowerCase();
      const filtered = reports.filter(
        (report) =>
          report.address &&
          report.address.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredReports(filtered);
    }
  }, [throttledSearchQuery, reports]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col p-8"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">
          Real-Time Disaster Map
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-all">
            <Filter size={20} />
            <span>Filter Reports</span>
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-black/60 p-6 rounded-xl shadow-lg backdrop-blur-md flex-1 overflow-hidden">
        <AzureMap reports={filteredReports} />
      </div>
    </div>
  );
}

export default MapPage;
