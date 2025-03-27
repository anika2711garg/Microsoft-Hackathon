import { useEffect, useState } from "react";
import { Filter, MapPin } from "lucide-react";
import AzureMap from "../components/AzureMap";

interface Report {
  location?: {
    latitude: number;
    longitude: number;
  };
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
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:3000/fetch_reports");
      
      if (!response.ok) {
        throw new Error("error fetching reports");
      }
      
      const data = await response.json();
      console.log("Reports fetched:", data.reports);
      // if (!data.reports || !Array.isArray(data.reports)) {
      //   throw new Error("Invalid data structure received from backend");
      // }
      setReports(data.reports);
    } catch (err: unknown) {
      setError((err as Error).message);
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col p-8"
      style={{
        // backgroundImage: url('/your-background-image.png'),
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
        <AzureMap reports={reports} />
        
        {/* Legend Section */}
        <div className="mt-6 flex flex-wrap gap-4 text-white">
          {Object.entries(severityColors).map(([severity, color]) => (
            <div key={severity} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
              <span>{severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MapPage;

