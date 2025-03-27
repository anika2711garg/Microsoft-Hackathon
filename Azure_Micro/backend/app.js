import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import axios from "axios";
import mongoose from "mongoose";
import fs from "fs";
import sdk from "microsoft-cognitiveservices-speech-sdk";
import cors from "cors";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import speech from "microsoft-cognitiveservices-speech-sdk";
import { getAccessToken } from "./utils/generateAccessToken.js";
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
  },
  severity: String,
  destruction_type: String,
  description: String,
  address: String,
  peopleAffected: Number,
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

import pkg from "@azure/communication-email";
const { EmailClient, EmailMessage, EmailContent } = pkg;

const emailClient = new EmailClient(
  process.env.COMMUNICATION_SERVICES_CONNECTION_STRING
);

app.get("/fetch_report/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    console.log(req.body)
    const emailMessage = {
      senderAddress: "DoNotReply@eb41ba9b-8e3e-4a28-be4b-27cc77a74414.azurecomm.net",
      content: {
        subject: subject,
        plainText: text,
        html: html
      },
      recipients: {
        to: [{ address: to }]
      }
    };

    const emailSendOperation = await emailClient.beginSend(emailMessage);
    res.json({ success: true, operationId: emailSendOperation.id });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/fetch_reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
ffmpeg.setFfmpegPath("D:/ffm/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe");

app.post("/convert-to-wav", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const tempInputPath = path.join(__dirname, "uploads", `${Date.now()}_input`);
  const tempOutputPath = path.join(
    __dirname,
    "uploads",
    `${Date.now()}_output.wav`
  );

 const uploadsDir = path.join(__dirname, "uploads");
 if (!fs.existsSync(uploadsDir)) {
   fs.mkdirSync(uploadsDir, { recursive: true });
 }


  // Write the buffer to a temporary file
  fs.writeFileSync(tempInputPath, req.file.buffer);

  ffmpeg(tempInputPath)
    .toFormat("wav")
    .on("start", (cmd) => {
      console.log("FFmpeg command:", cmd);
    })
    .on("progress", (progress) => {
      console.log("Processing progress:", progress);
    })
    .on("end", () => {
      console.log("Conversion complete.");
      res.download(tempOutputPath, "converted_audio.wav", (err) => {
        if (err) {
          console.error("Error during file download:", err);
        }
        fs.unlinkSync(tempInputPath);
        fs.unlinkSync(tempOutputPath);
      });
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err.message);
      res.status(500).send("Error processing audio file");
      if (fs.existsSync(tempInputPath)) {
        fs.unlinkSync(tempInputPath);
      }
      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      }
    })
    .save(tempOutputPath);

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

const VIDEO_INDEXER_API_KEY = "cafee043-0ec8-44e5-91ab-65a1afad5a91";
const ACCOUNT_ID = "438cda5a-251f-4c17-8415-d9579ac378b0";
const LOCATION = "eastus";

// const getAccessToken = async () => {
//   const response = await axios.post(
//     `https://api.videoindexer.ai/Auth/${LOCATION}/Accounts/${ACCOUNT_ID}/AccessToken`,
//     null,
//     {
//       headers: {
//         "Ocp-Apim-Subscription-Key": VIDEO_INDEXER_API_KEY,
//       },
//     }
//   );
//   console.log("Access Token:", response.data);

//   return response.data;
// };

//   const uploadVideoToIndexer = async (videoUrl) => {
//   const accessToken = await getAccessToken();
//   const endpoint = https://api.videoindexer.ai/${LOCATION}/Accounts/${ACCOUNT_ID}/Videos?accessToken=${accessToken};

//   const response = await axios.post(
//     endpoint,
//     {
//       name: "My Video",
//       description: "Uploaded via API",
//       privacy: "Private",
//       videoUrl,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   console.log("Video uploaded successfully:", response.data);
//   return response.data;
// };

// Report Submission API

app.post("/uploadToVideoIndexer", async (req, res) => {
  try {
    const { videoUrl, fileName } = req.body;
    console.log("Received body:", req.body);

    if (!videoUrl || !fileName) {
      return res
        .status(400)
        .json({ message: "Video URL and file name are required" });
    }

    const videoIndexerAccessToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJWZXJzaW9uIjoiMi4wLjAuMCIsIktleVZlcnNpb24iOiI3NTExMjE1MGMzNDg0ZjI1ODdhNGFiMWE2OTMyMjE1OCIsIkFjY291bnRJZCI6IjQzOGNkYTVhLTI1MWYtNGMxNy04NDE1LWQ5NTc5YWMzNzhiMCIsIkFjY291bnRUeXBlIjoiQXJtIiwiUGVybWlzc2lvbiI6IkNvbnRyaWJ1dG9yIiwiRXh0ZXJuYWxVc2VySWQiOiJBMEI5MkU1OEE2NTU0NkMzODBENDI5OTVERDhGMTc3NSIsIlVzZXJUeXBlIjoiTWljcm9zb2Z0Q29ycEFhZCIsIklzc3VlckxvY2F0aW9uIjoiZWFzdHVzIiwibmJmIjoxNzQzMDM2MDc4LCJleHAiOjE3NDMwMzk5NzgsImlzcyI6Imh0dHBzOi8vYXBpLnZpZGVvaW5kZXhlci5haS8iLCJhdWQiOiJodHRwczovL2FwaS52aWRlb2luZGV4ZXIuYWkvIn0.GuDoXdBzUf0Sg1T3tnHwNZwF-BY5t-p8i22J5UlIMeAVC-ilpkA0D9tCF3oHMXUxRc1o9zkmdlC7U-afCCz41HWXuMT8uB4UjFGlW5aSamxF6dECxIysHeA1eOHmcMDlyLuCbztLyo5USJwOpCGte6Uz9pRr-WkqyyN-yg-5ihUP0v5y7kdELpO-oCC1YsAv2iAp4esWTMB1fnp4wnwqcdU52Eez3qJ_ZnQJCiyKgakgOo_0mrF6Lv55FvoTLCZCM4NdRD8xD8bwvJU-TjK2Dvod0beQ5sEEJmk7OrNRrShDTiPcTYbWUlPnf8Iy_xaicJ2jvR4Qs-BCbrGphiO2Kw";
    // console.log("Video Indexer Access Token:", videoIndexerAccessToken);

    // Construct the URL with query parameters
    const uploadUrl = `https://api.videoindexer.ai/eastus/Accounts/438cda5a-251f-4c17-8415-d9579ac378b0/Videos?accessToken=${encodeURIComponent(
      videoIndexerAccessToken
    )}&name=fire&privacy=Private&language=English&videoUrl=${encodeURIComponent(
      videoUrl
    )}&fileName=${encodeURIComponent(
      fileName
    )}&isSearchable=true&indexingPreset=Default&streamingPreset=Default&sendSuccessEmail=false&useManagedIdentityToDownloadVideo=false&preventDuplicates=false`;

    // Make the POST request
    const response = await axios.post(uploadUrl, null, {
      headers: {
        Authorization: `Bearer ${videoIndexerAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Send response back to the client
    res.status(200).json({
      message: "Video uploaded to Azure Video Indexer successfully",
      data: response.data,
    });
    console.log("Video uploaded to Azure Video Indexer successfully", response.data);
    
  } catch (error) {
    console.error(
      "Error uploading video to Azure Video Indexer:",
      error.response?.data || error.message
    );

    res
      .status(500)
      .json({
        message: "Error uploading video",
        error: error.response?.data || error.message,
      });
  }
});

app.get("/getVideoInsights/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;

    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const videoIndexerAccessToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJWZXJzaW9uIjoiMi4wLjAuMCIsIktleVZlcnNpb24iOiI3NTExMjE1MGMzNDg0ZjI1ODdhNGFiMWE2OTMyMjE1OCIsIkFjY291bnRJZCI6IjQzOGNkYTVhLTI1MWYtNGMxNy04NDE1LWQ5NTc5YWMzNzhiMCIsIkFjY291bnRUeXBlIjoiQXJtIiwiUGVybWlzc2lvbiI6IkNvbnRyaWJ1dG9yIiwiRXh0ZXJuYWxVc2VySWQiOiJBMEI5MkU1OEE2NTU0NkMzODBENDI5OTVERDhGMTc3NSIsIlVzZXJUeXBlIjoiTWljcm9zb2Z0Q29ycEFhZCIsIklzc3VlckxvY2F0aW9uIjoiZWFzdHVzIiwibmJmIjoxNzQzMDM2MDc4LCJleHAiOjE3NDMwMzk5NzgsImlzcyI6Imh0dHBzOi8vYXBpLnZpZGVvaW5kZXhlci5haS8iLCJhdWQiOiJodHRwczovL2FwaS52aWRlb2luZGV4ZXIuYWkvIn0.GuDoXdBzUf0Sg1T3tnHwNZwF-BY5t-p8i22J5UlIMeAVC-ilpkA0D9tCF3oHMXUxRc1o9zkmdlC7U-afCCz41HWXuMT8uB4UjFGlW5aSamxF6dECxIysHeA1eOHmcMDlyLuCbztLyo5USJwOpCGte6Uz9pRr-WkqyyN-yg-5ihUP0v5y7kdELpO-oCC1YsAv2iAp4esWTMB1fnp4wnwqcdU52Eez3qJ_ZnQJCiyKgakgOo_0mrF6Lv55FvoTLCZCM4NdRD8xD8bwvJU-TjK2Dvod0beQ5sEEJmk7OrNRrShDTiPcTYbWUlPnf8Iy_xaicJ2jvR4Qs-BCbrGphiO2Kw";
    // console.log("Video Indexer Access Token:", videoIndexerAccessToken);

    const insightsUrl = `https://api.videoindexer.ai/eastus/Accounts/438cda5a-251f-4c17-8415-d9579ac378b0/Videos/${videoId}/Index?reTranslate=false&includeStreamingUrls=true&includeSummarizedInsights=true`;

    const response = await axios.get(insightsUrl, {
      headers: {
        Authorization: `Bearer ${videoIndexerAccessToken}`,
      },
    });

    res.status(200).json({
      message: "Video insights retrieved successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error retrieving video insights:", error);
    res.status(500).json({ message: "Error retrieving video insights", error });
  }
});



app.post(
  "/report",
  upload.fields([{ name: "image" }, { name: "audio" }]),
  async (req, res) => {
    try {
      const {
        severity,
        address,
        peopleAffected,
        destruction_type,
        description,
        lat,
        lng,
      } = req.body;
      console.log(req.body);
      let imageCaption = null;
      let audioTranscription = null;

      // Analyze Image if provided
      if (req.files?.image) {
        imageCaption = await analyzeImage(req.files.image[0].buffer);
        imageCaption = imageCaption.map((caption) => caption.text).join("\n");
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
        location: { latitude: lat, longitude: lng, address: address },
        severity,
        destruction_type,
        address,
        peopleAffected: peopleAffected,
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
  }
);

app.listen(port, () => console.log(`Server running on port ${port}`));
