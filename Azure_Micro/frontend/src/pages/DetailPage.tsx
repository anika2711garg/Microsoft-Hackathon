import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/fetch_report/${reportId}`
        );
        setReport(response.data.report);
        setLoading(false);

        // Assuming the report contains a videoId field
        if (response.data.report && response.data.report.videoId) {
          setVideoId(response.data.report.videoId);
        }
      } catch (err) {
        setError("Failed to fetch report");
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading)
    return (
      <div className="text-center text-xl font-bold text-blue-500 animate-pulse">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 font-semibold">{error}</div>
    );
  if (!report)
    return (
      <div className="text-center text-gray-500 font-medium">
        No report found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 text-white shadow-2xl rounded-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white font-semibold rounded-lg shadow-md"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Report Details */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-t-lg text-center shadow-lg">
            <h1 className="text-3xl font-bold tracking-wide uppercase">
              Report Details
            </h1>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-blue-400">Severity</p>
              <p className="text-gray-300">{report.severity}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-yellow-400">
                Destruction Type
              </p>
              <p className="text-gray-300">{report.destruction_type}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-green-400">
                People Affected
              </p>
              <p className="text-gray-300">{report.peopleAffected}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-red-400">Date</p>
              <p className="text-gray-300">
                {new Date(report.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-pink-400">Address</p>
            <p className="text-gray-300">{report.address}</p>
          </div>

          {/* Location */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between">
            <p className="text-lg font-semibold text-indigo-400">Location</p>
            <p className="text-gray-300">
              Latitude : {report.location.latitude}°N, Lng:{" "}
              {report.location.longitude}°E
            </p>
          </div>

          {/* Description */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-cyan-400">Description</p>
            <p className="text-gray-300">{report.description}</p>
          </div>

          {/* Media */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-purple-400 mb-2">Media</h2>
            <p className="text-gray-300">
              <strong className="text-orange-400">Text:</strong>{" "}
              {report.media.text}
            </p>
            <p className="text-gray-300">
              <strong className="text-orange-400">Image Description:</strong>{" "}
              {report.media.image_description}
            </p>
            <p className="text-gray-300">
              <strong className="text-orange-400">Audio Transcription:</strong>{" "}
              {report.media.audio_transcription}
            </p>
          </div>
        </div>

        {/* Right Side: Video and Insights */}
        <div className="space-y-6">
          {/* Video Player */}
          {videoId && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-teal-400 mb-4">
                  Video Player
                </h2>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.videoindexer.ai/embed/player/438cda5a-251f-4c17-8415-d9579ac378b0/${videoId}/?&locale=en&location=eastus`}
                  allowFullScreen
                ></iframe>
              </div>

              {/* Embedded Insights */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-teal-400 mb-4">
                  Video Insights
                </h2>
                <iframe
                  width="1280"
                  height="900"
                  src={`https://www.videoindexer.ai/embed/insights/438cda5a-251f-4c17-8415-d9579ac378b0/${videoId}/?&locale=en&location=eastus`}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg shadow-lg w-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
