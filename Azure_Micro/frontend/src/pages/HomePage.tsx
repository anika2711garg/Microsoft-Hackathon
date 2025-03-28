import React, { useState, useRef } from 'react';
import { Upload, Mic, Camera, MapPin } from 'lucide-react';
import axios from 'axios';

function HomePage() {
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [address, setAddress] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [peopleAffected, setPeopleAffected] = useState<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [videoId, setVideoId] = useState(""); 
  const [insights, setInsights] = useState(null); 
  const [publicURL, setPublicURL] = useState(""); // State to store the public URL of the uploaded video

  
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      var publicUrl;
      try {
        setUploading(true);
        setUploadStatus("Uploading...");

        const response = await fetch("http://localhost:3000/uploadVideo", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          publicUrl = data.publicUrl;
          setUploadStatus(`Upload successful! File URL: ${data.publicUrl}`);
          setPublicURL(data.publicUrl); // Save the public URL to state
          console.log("File uploaded to Blob Storage:", data.publicUrl);
        } else {
          const error = await response.json();
          setUploadStatus(`Error: ${error.message}`);
        }

        setUploadStatus(
          "File uploaded to Blob Storage. Uploading to Video Indexer..."
        );

        // Then upload the public URL to Azure Video Indexer
        const indexerResponse = await fetch(
          "http://localhost:3000/uploadToVideoIndexer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              videoUrl: publicUrl, // The public URL of the video
              fileName: `${Date.now().toLocaleString}.mp4`,
            }),
          }
        );

        if (!indexerResponse.ok) {
          const error = await indexerResponse.json();
          throw new Error(error.message);
        }

        const indexerData = await indexerResponse.json();
        setUploadStatus(
          `Video successfully indexed! Indexer ID: ${indexerData.data.id}`
        );
        setVideoId(indexerData.data.id);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Error uploading file.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGetInsights = async () => {
    if (!videoId) {
      setUploadStatus("No video ID available to fetch insights.");
      return;
    }

    try {
      setUploadStatus("Fetching insights...");
      const response = await fetch(
        `http://localhost:3000/getVideoInsights/${videoId}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setInsights(data.data); // Save the retrieved insights
      setUploadStatus("Insights fetched successfully!");
      console.log("Video insights:", data.data);
    } catch (error) {
      console.error("Error fetching video insights:", error);
      setUploadStatus("Error fetching video insights.");
    }
  };

  const [disasterType, setDisasterType] = useState("");
  const [description,setDescription] = useState("")
  const [severity,setSeverity] = useState("")
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisasterType(e.target.value);
  };
  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeverity(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!image || !audioChunksRef.current) {
      alert("Please select an image and record audio before submitting.");
      return;
    }
  
    // Convert recorded audio chunks into a single Blob
   const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" }); // Original format
   const formDataAudio = new FormData();
   formDataAudio.append("audio", audioBlob);
    try {
      const responseAudio = await axios.post(
        "http://localhost:3000/convert-to-wav",
        formDataAudio,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob", // Expect a binary response
        }
      );

      const convertedAudioBlob = new Blob([responseAudio.data], {
        type: "audio/wav",
      });
      const convertedAudioURL = URL.createObjectURL(convertedAudioBlob);
      setAudioURL(convertedAudioURL); // Update the UI or use this URL for further processing

      const formData = new FormData();
      formData.append("severity", severity);
      formData.append("destruction_type", disasterType);
      formData.append("description", description);
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);
      formData.append("address", address);
      formData.append("peopleAffected", peopleAffected.toString());
      formData.append("image", image); // Ensure `image` is a File object
      formData.append("audio", convertedAudioBlob, "recorded_audio.wav");
      formData.append("videoId", videoId); // Include the video ID if needed
      formData.append("videoURL", publicURL); // Include the public URL if needed

      const response = await axios.post(
        "http://localhost:3000/report",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Report submitted successfully:", response.data);
      const emailData = {
        reporterName: "John Doe", // Replace with actual reporter's name
        location: address,
        disasterType: disasterType,
        description: description,
    };

    await fetch("http://localhost:7071/api/sendEmailTrigger", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Origin": "http://localhost:5173" },
        body: JSON.stringify(emailData),
    });

    console.log("Email notification sent successfully");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };
  

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          setLocation({ lat, lng });
          await fetchAddress(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const fetchAddress = async (lat: string, lng: string) => {
    if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
      setAddress("Invalid coordinates");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_AZURE_MAPS_API_KEY;
      const url = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key=${apiKey}&query=${lat},${lng}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const addressResult = data.addresses?.[0]?.address?.freeformAddress;
      setAddress(addressResult || "Address not found");
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };


  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleLocationChange = (key: "lat" | "lng", value: string) => {
    setLocation((prev) => ({ ...prev, [key]: value }));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchAddress(
        key === "lat" ? value : location.lat,
        key === "lng" ? value : location.lng
      );
    }, 500); // Debounce delay of 500ms
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/your-background-image.png')`,
      }}
    >
      <div className="bg-black/60 p-10 rounded-xl shadow-2xl backdrop-blur-md max-w-lg w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
          Report a Disaster
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disaster Type */}
          <div>
            <label className="block text-white font-medium mb-2">
              Disaster Type
            </label>
            <select
              className="w-full border border-gray-400 rounded-lg p-3 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
              value={disasterType}
              onChange={handleSelectChange}
            >
              <option value="">Select disaster type</option>
              <option value="fire">Fire</option>
              <option value="flood">Flood</option>
              <option value="earthquake">Earthquake</option>
              <option value="accident">Accident</option>
            </select>
          </div>
          {/* Severity Level */}
          <div>
            <label className="block text-white font-medium mb-2">
              Severity Level
            </label>
            <select
              className="w-full border border-gray-400 rounded-lg p-3 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
              value={severity}
              onChange={handleSeverityChange}
            >
              <option value="">Select severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          {/* People Affected */}
          <div>
            <label className="block text-white font-medium mb-2">
              People Affected
            </label>
            <input
              type="number"
              min="0"
              value={peopleAffected}
              onChange={(e) => setPeopleAffected(parseInt(e.target.value))}
              className="w-full border border-gray-400 rounded-lg p-3 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-400 rounded-lg p-3 h-28 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
              placeholder="Describe the situation..."
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={location.lat}
                onChange={(e) => handleLocationChange("lat", e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-3 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={location.lng}
                onChange={(e) => handleLocationChange("lng", e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-3 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
              />
            </div>
          </div>
          {/* Address */}
          <div>
            <label className="block text-white font-medium mb-2">Address</label>
            <textarea
              value={address}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-3 h-23 focus:ring-4 focus:ring-yellow-400 transition bg-gray-700 text-white"
            />
          </div>

          {/* Location Button */}
          <button
            type="button"
            onClick={getCurrentLocation}
            className="flex items-center space-x-2 text-yellow-300 hover:text-yellow-500 transition duration-300"
          >
            <MapPin size={20} />
            <span>Get Current Location</span>
          </button>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <label className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg shadow transition-all cursor-pointer">
              <Upload size={20} />
              <span>Upload Video</span>
              <input
                type="file"
                accept="*"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading && <p className="mt-4 text-blue-500">Uploading...</p>}
              {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
            </label>

            <button
              type="button"
              className={`flex-1 flex items-center justify-center space-x-2 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white py-3 rounded-lg transition-all`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic size={20} />
              <span>{isRecording ? "Stop Recording" : "Record Voice"}</span>
            </button>

            <label className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg shadow transition-all cursor-pointer">
              <Camera size={20} />
              <span>Take Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Recorded Audio */}
          {audioURL && (
            <div className="mt-4">
              <label className="block text-white font-medium mb-2">
                Recorded Audio
              </label>
              <audio
                controls
                src={audioURL}
                className="w-full bg-gray-700 rounded-lg p-2"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-4 rounded-lg shadow-lg transition-all"
          >
            Submit Report
          </button>

          <button
            onClick={handleGetInsights}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-4 rounded-lg shadow-lg transition-all"
          >
            Get Insights
          </button>
          {insights && (
            <div>
              <h2>Video Insights</h2>
              <pre>{JSON.stringify(insights, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default HomePage;