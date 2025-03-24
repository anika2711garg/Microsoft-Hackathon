import { useEffect, useRef } from "react";
import * as atlas from "azure-maps-control";
import { Filter, MapPin } from "lucide-react";
import AzureMap from "../components/AzureMap";

type Incident = {
  id: string;
  type: "Fire" | "Flood" | "Accident" | "Earthquake" | "Landslide";
  coordinates: [number, number]; // [longitude, latitude]
};

const dummyIncidents: Incident[] = [
  { id: "1", type: "Fire", coordinates: [-97.7431, 30.2672] },
  { id: "2", type: "Flood", coordinates: [-122.3321, 47.6062] },
  { id: "3", type: "Earthquake", coordinates: [-118.2437, 34.0522] },
  { id: "4", type: "Accident", coordinates: [-73.935242, 40.73061] },
  { id: "5", type: "Landslide", coordinates: [-123.1216, 49.2827] },
];

const incidentColors: Record<Incident["type"], string> = {
  Fire: "#FF0000",
  Flood: "#0000FF",
  Accident: "#FFFF00",
  Earthquake: "#800080",
  Landslide: "#008000",
};

function MapPage() {

  return (
    <div
      className="min-h-screen flex flex-col p-8"
      style={{
        backgroundImage: `url('/your-background-image.png')`,
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
          {/* Search Input */}
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

          {/* Filter Button */}
          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-all">
            <Filter size={20} />
            <span>Filter Reports</span>
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-black/60 p-6 rounded-xl shadow-lg backdrop-blur-md flex-1 overflow-hidden">
        <AzureMap/>
        {/* <div
          ref={mapRef}
          className="h-[600px] bg-gray-900/50 rounded-lg flex-1 overflow-hidden relative"
        ></div> */}

        {/* Legend Section */}
        <div className="mt-6 flex flex-wrap gap-4 text-white">
          {Object.entries(incidentColors).map(([type, color]) => (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MapPage;
