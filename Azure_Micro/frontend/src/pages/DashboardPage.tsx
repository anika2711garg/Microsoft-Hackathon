import React, { useRef } from 'react';
import { Search, Filter, AlertTriangle } from 'lucide-react';

function DashboardPage() {
  const dashboardRef = useRef(null);

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen p-8"
      style={{ backgroundImage: `url('/your-background-image.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Report History</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
          </div>

          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-all">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-black/60 rounded-xl shadow-lg backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-800 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <AlertTriangle className="text-red-500 mr-2" size={20} />
                    <span>Fire</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">34.0522° N, 118.2437° W</td>
                <td className="px-6 py-4 whitespace-nowrap">2024-03-15 14:30</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-white">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-400 hover:text-indigo-500 transition">
                    View Details
                  </button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
