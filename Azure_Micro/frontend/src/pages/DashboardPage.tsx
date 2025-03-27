import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, AlertTriangle } from "lucide-react";
import axios from "axios";
import DetailPage from "./DetailPage";
import { useNavigate } from "react-router-dom";
// import DetailPage from "./DetailPage";
function DashboardPage() {
  const navigate = useNavigate()
  const dashboardRef = useRef(null);
  interface Report {
    _id: string;
    address: string;
    destruction_type: string;
    location: {
      latitude: number;
      longitude: number;
    };
    timestamp: string;
  }

  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3000/fetch_reports"); // Adjust API endpoint
        console.log(response.data);
        const data = Array.isArray(response.data.reports) ? response.data.reports : [];
        console.log("Reports fetched:", data);
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  // Filter reports based on search input and selected filters
  useEffect(() => {
    console.log("reports are",reports);
    let filtered = reports.filter((report) => {
      console.log("report is",report);
      return (

        console.log("report is",report),
        (selectedType ? report.destruction_type?.toLowerCase() === selectedType.toLowerCase() : true) &&
        (selectedLocation
          ? `${report.address}`
              .toLowerCase()
              .includes(selectedLocation.toLowerCase())
          : true) &&
        (selectedDate ? report.timestamp?.startsWith(selectedDate) : true) &&
        (searchQuery
          ? report.destruction_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${report.location?.latitude || ""}, ${report.location?.longitude || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.timestamp?.includes(searchQuery)
          : true)
      );
    });

    setFilteredReports(filtered);
  }, [searchQuery, selectedType, selectedLocation, selectedDate, reports]);

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen p-8"
      style={{
        backgroundImage: `url('/your-background-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Report History</h1>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
          </div>

          {/* Filter Options */}
          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow focus:outline-none"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="fire">Fire</option>
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
          </select>

          <input
            type="text"
            placeholder="Location..."
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow focus:outline-none"
            onChange={(e) => setSelectedLocation(e.target.value)}
          />

          <input
            type="date"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow focus:outline-none"
            onChange={(e) => setSelectedDate(e.target.value)}
          />

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
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AlertTriangle className="text-red-500 mr-2" size={20} />
                        <span>{report.destruction_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    
                      {/* {report.location ? `${report.location.latitude}, ${report.location.longitude}` : "Location not available"} */}
                      {report.address ? report.address : "Address not available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(report.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-white">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
      <button
        onClick={() => navigate(`/reports/${report._id}`)}
        className="text-indigo-400 hover:text-indigo-500 transition"
      >
        View Details
      </button>
    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button  className="text-indigo-400 hover:text-indigo-500 transition">View Details</button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-4">
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
