import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import axios from "axios";
import mongoose from "mongoose";
import fs from "fs";
import sdk from "microsoft-cognitiveservices-speech-sdk";
import cors from "cors";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import speech from "microsoft-cognitiveservices-speech-sdk";
// Configure dotenv
dotenv.config();

const app = express();
app.use(express.json());
const port = 3000;
app.use(cors());
// const fs = require("fs");
// const sdk = require("microsoft-cognitiveservices-speech-sdk");
// Load environment variables
const API_KEY = process.env.AZURE_COMPUTER_VISION_KEY;
const ENDPOINT = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;
const MONGO_URI = process.env.MONGODB_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI, {});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
const speechConfig = sdk.SpeechConfig.fromSubscription(
  AZURE_SPEECH_KEY,
  AZURE_SPEECH_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";

// Increase initial silence timeout (default is too short)
speechConfig.setProperty(
  sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
  "5000" // 5 seconds
);
// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define Report Schema
const ReportSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  severity: String,
  destruction_type: String,
  description: String,
  media: {
    text: String,
    image_description: String,
    audio_transcription: String,
  },
});

const Report = mongoose.model("Report", ReportSchema);

// Azure Vision API Request
async function analyzeImage(imageBuffer) {
  try {
    const url = `${ENDPOINT}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=denseCaptions`;
    const headers = {
      "Ocp-Apim-Subscription-Key": API_KEY,
      "Content-Type": "application/octet-stream",
    };

    // Send request to Azure Vision API
    const response = await axios.post(url, imageBuffer, { headers });

    const data = response.data;
    let captions = [];
    if (data.denseCaptionsResult && data.denseCaptionsResult.values) {
      captions = data.denseCaptionsResult.values.map((item) => ({
        text: item.text,
        confidence: item.confidence.toFixed(2),
      }));
    }

    const respon = captions.map((caption) => caption.text).join("\n");
    console.log(respon); // Log the extracted captions

    return captions;
  } catch (error) {
    console.error(
      "Azure Vision Error:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// Azure Speech-to-Text
async function processAudio(audioBuffer) {
  try {
    if (!audioBuffer) {
      console.log("No file uploaded.");
      return null;
    }

    console.log("Uploaded File Details:", audioBuffer);

    // Save and debug the received audio file
    const debugFilePath = "debug_audio.wav";
    fs.writeFileSync(debugFilePath, audioBuffer);
    console.log(`Saved debug audio file: ${debugFilePath}`);

    // Check if the file is not empty
    if (audioBuffer.size === 0) {
      console.log("Uploaded file is empty.");
      return null;
    }

    // Create an AudioConfig using the buffer
    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    console.log("Recognizing Speech...");

    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (result) => {
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            console.log("Recognized Text:", result.text);
            resolve(result.text);
          } else {
            console.error("Speech recognition failed:", result);
            resolve(null);
          }
        },
        (err) => {
          console.error("Error during recognition:", err);
          reject(err);
        }
      );
    });
  } catch (error) {
    console.error("Server Error:", error);
    return null;
  }
}

app.get("/fetch_reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

const ACCOUNT_NAME = "videoin";
const ACCOUNT_KEY =
  "jjemQqFOcqj7ekLpVnyzhH7zbW1NJZySlGAT89cNhWJ0ZmZbPTgEuJt3W6NLK+iX13gzcdQrFl02+AStpLUXJA==";
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = "uploadvideo";
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient =
  blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

app.post("/uploadVideo", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const blobName = `upload_${Date.now()}_${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Blob Storage
    await blockBlobClient.uploadData(file.buffer);
    const blobUrl = blockBlobClient.url;
    // Generate SAS token
    const sasToken = generateBlobSAS(
      blobName,
      AZURE_CONTAINER_NAME,
      ACCOUNT_NAME,
      ACCOUNT_KEY
    );

    // Publicly accessible URL
    const publicUrl = `${blobUrl}?${sasToken}`;

    console.log("File uploaded successfully:", publicUrl);
    res.status(201).json({ message: "File uploaded successfully", publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

function generateBlobSAS(blobName, containerName, accountName, accountKey) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  // Define SAS permissions
  const permissions = BlobSASPermissions.parse("r"); // Read-only access

  // Set SAS token options
  const sasOptions = {
    containerName,
    blobName,
    permissions,
    startsOn: new Date(), // Token is valid immediately
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Valid for 1 hour
  };

  // Generate SAS token
  return generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();
}

const VIDEO_INDEXER_API_KEY = process.env.AZURE_VIDEO_INDEXER_API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const LOCATION = process.env.LOCATION;

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
  console.log("Access Token:", response.data);

  return response.data;
};

app.post("/uploadToVideoIndexer", async (req, res) => {
  try {
    const { videoUrl } = req.body;
    console.log("Received body:", req.body);

    const videoIndexerAccessToken = await getAccessToken();

    console.log("Video Indexer Access Token:", videoIndexerAccessToken);

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL is required" });
    }

    const uploadUrl = `https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos?accessToken=${videoIndexerAccessToken}&name=${encodeURIComponent(
      "Uploaded Video"
    )}&description=${encodeURIComponent("Video uploaded via API")}`;

    const response = await axios.post(uploadUrl, null, {
      headers: {
        "Ocp-Apim-Subscription-Key": VIDEO_INDEXER_API_KEY,
        "Content-Type": "application/json",
      },
      params: {
        videoUrl,
      },
    });

    res.status(200).json({
      message: "Video uploaded to Azure Video Indexer successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error uploading video to Azure Video Indexer:", error);
    res.status(500).json({ message: "Error uploading video", error });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
// Report Submission API
app.post("/report", upload.fields([{ name: "image" }, { name: "audio" }]), async (req, res) => {
  try {
    const { severity, destruction_type, description, lat, lng } = req.body;
    console.log(req.body)
    let imageCaption = null;
    let audioTranscription = null;

    // Analyze Image if provided
    if (req.files?.image) {
      imageCaption = await analyzeImage(req.files.image[0].buffer);
      imageCaption = imageCaption.map(caption => caption.text).join("\n")
    }

    console.log("The image description:", imageCaption);

    // Process Audio if provided
    if (req.files?.audio) {
      console.log("Processing audio for transcription...");
      audioTranscription = await processAudio(req.files.audio[0].buffer);
      console.log("Audio transcription completed:", audioTranscription);
    }

    // Create report after both tasks are completed
    const report = new Report({
      location: { latitude: lat, longitude: lng },
      severity,
      destruction_type,
      description,
      media: {
        text: description,
        image_description: imageCaption,
        audio_transcription: audioTranscription,
      },
    });

    await report.save();
    console.log("Report saved successfully!");

    res.json({ success: true, report });

  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));