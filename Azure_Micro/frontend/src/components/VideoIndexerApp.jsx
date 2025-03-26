import React, { useState } from "react";
import axios from "axios";

const VideoIndexerApp = () => {
  const [azureAccessToken, setAzureAccessToken] = useState("");
  const [indexerAccessToken, setIndexerAccessToken] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoInsights, setVideoInsights] = useState(null);

  const subscriptionId = "cafee043-0ec8-44e5-91ab-65a1afad5a91";
  const resourceGroupName = "disaster-reporter";
  const accountName = "disaster";
  const region = "eastus";
  const accountId = "438cda5a-251f-4c17-8415-d9579ac378b0";
  const videoUrl = "<SAS URL for your video file>"; // Replace with the SAS URL

  // Step 1: Generate Azure Video Indexer Access Token
  const getIndexerAccessToken = async () => {
    try {
      const azureCliAccessToken = "<Your Azure CLI access token here>"; // Replace with Azure CLI token

      const response = await axios.post(
        `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.VideoIndexer/accounts/${accountName}/generateAccessToken?api-version=2025-01-01`,
        {},
        {
          headers: {
            Authorization: `Bearer ${azureCliAccessToken}`,
          },
        }
      );

      setIndexerAccessToken(response.data.accessToken);
      console.log("Indexer Access Token Generated:", response.data.accessToken);
    } catch (error) {
      console.error("Error generating indexer access token:", error);
    }
  };

  // Step 2: Upload the video to Video Indexer
  const uploadVideo = async () => {
    try {
      const response = await axios.post(
        `https://api.videoindexer.ai/${region}/Accounts/${accountId}/Videos`,
        null,
        {
          params: {
            name: "fireVids",
            privacy: "Private",
            language: "English",
            videoUrl: videoUrl,
            fileName: "fireVids.mp4",
            isSearchable: true,
            indexingPreset: "Default",
            streamingPreset: "Default",
            sendSuccessEmail: false,
            useManagedIdentityToDownloadVideo: false,
            preventDuplicates: false,
          },
          headers: {
            Authorization: `Bearer ${indexerAccessToken}`,
          },
        }
      );

      setVideoId(response.data.id);
      console.log("Video uploaded successfully, Video ID:", response.data.id);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // Step 3: Get video insights
  const getVideoInsights = async () => {
    try {
      const response = await axios.get(
        `https://api.videoindexer.ai/${region}/Accounts/${accountId}/Videos/${videoId}/Index`,
        {
          params: {
            reTranslate: false,
            includeStreamingUrls: true,
            includeSummarizedInsights: true,
          },
          headers: {
            Authorization: `Bearer ${indexerAccessToken}`,
          },
        }
      );

      setVideoInsights(response.data);
      console.log("Video insights:", response.data);
    } catch (error) {
      console.error("Error fetching video insights:", error);
    }
  };

  return (
    <div>
      <h1>Azure Video Indexer</h1>

      {/* Step 1: Generate Access Token */}
      <button onClick={getIndexerAccessToken}>Generate Access Token</button>

      {/* Step 2: Upload Video */}
      <button onClick={uploadVideo} disabled={!indexerAccessToken}>
        Upload Video
      </button>

      {/* Step 3: Get Video Insights */}
      <button onClick={getVideoInsights} disabled={!videoId}>
        Get Video Insights
      </button>

      {/* Display Video Insights */}
      {videoInsights && (
        <div>
          <h2>Video Insights</h2>
          <pre>{JSON.stringify(videoInsights, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VideoIndexerApp;
