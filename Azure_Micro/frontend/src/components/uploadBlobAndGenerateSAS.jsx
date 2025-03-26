

const accountName = "<your-account-name>"; // Replace with your Azure Blob Storage account name
const accountKey = "<your-account-key>"; // Replace with your Azure Blob Storage account key
const containerName = "uploadvids"; // Container name
const blobName = "example-video.mp4"; // Replace with your file name
const localFilePath = "<path-to-your-local-file>"; // Local file path to upload

const axios = require("axios");

const VIDEO_INDEXER_API_KEY = "YOUR_VIDEO_INDEXER_API_KEY";
const ACCOUNT_ID = "YOUR_ACCOUNT_ID";
const LOCATION = "YOUR_LOCATION";

const getAccessToken = async () => {
  const response = await axios.post(
    `https://api.videoindexer.ai/Auth/${LOCATION}/Accounts/${ACCOUNT_ID}/AccessToken`,
    null,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": VIDEO_INDEXER_API_KEY,
      },
    }
  );
  return response.data;
};

const uploadVideo = async (videoUrl) => {
  const accessToken = await getAccessToken();
  const endpoint = `https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos?accessToken=${accessToken}`;

  const response = await axios.post(
    endpoint,
    {
      name: "My Video",
      description: "Uploaded via API",
      privacy: "Private",
      videoUrl,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Video uploaded successfully:", response.data);
  return response.data;
};