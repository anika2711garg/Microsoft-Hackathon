import { useRef } from 'react';
import { Filter, MapPin } from 'lucide-react';

function MapPage() {
  const mapContainerRef = useRef(null);

  return (
    <div
      ref={mapContainerRef}
      className="min-h-screen flex flex-col p-8"
      style={{ backgroundImage: `url('/your-background-image.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Real-Time Disaster Map</h1>

        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Filter Button */}
          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-all">
            <Filter size={20} />
            <span>Filter Reports</span>
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-black/60 p-6 rounded-xl shadow-lg backdrop-blur-md">
        <div className="h-[600px] bg-gray-900/50 rounded-lg flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <MapPin size={48} className="text-gray-300 mx-auto" />
            <div className="text-gray-400">Disaster reports will appear here soon</div>
          </div>
        </div>

        {/* Legend Section */}
        <div className="mt-6 flex flex-wrap gap-4 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Fire</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Flood</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Accident</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Earthquake</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Landslide</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
