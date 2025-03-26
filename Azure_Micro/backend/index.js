const express = require("express");
const multer = require("multer");
const axios = require("axios");
const speech = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { type } = require("os");
const app = express();
const port = 3000;
const mongoose = require("mongoose")
// Azure Vision API credentials
const API_KEY = "9ZrXRHHXjesl6KlEPX67r3ak4hm3g3r3WEpDL6qq0taOFVJDNONtJQQJ99BCACYeBjFXJ3w3AAAFACOG1vls";
const ENDPOINT = "https://disastwe.cognitiveservices.azure.com/";
const AZURE_SPEECH_KEY = "DxC25E1gpi4zNCAV1zTWKusM0iHMz8023kvst0Xy1xbeG8uSmabVJQQJ99BCACYeBjFXJ3w3AAAYACOGlPu5"
const AZURE_SPEECH_REGION="eastus"

// API URL for image captioning
const url = `${ENDPOINT}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=denseCaptions`;

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// app.post("/report", async (req, res) => {
    
// })
// Endpoint to handle image upload and processing

// Define Report Schema
const ReportSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  severity: String,
  destruction_type: String,
  description: String,
  media: {
    text: String,
    image_url: String,
    audio_transcription: String,
    video_url: String
  },
  
});
const Report = mongoose.model("Report", ReportSchema);
// Report Submission API
app.post("/report", upload.fields([{ name: "image" }]), async (req, res) => {
  try {
    const { severity, destruction_type, description } = req.body;
    const { latitude, longitude } = req.body;
    
    const locationAddress = await getLocationDetails(latitude, longitude);
    let audioTranscription = null;

    if (req.files?.audio) {
      audioTranscription = await processAudio(req.files.audio[0].buffer);
    }

    const report = new Report({
      location: { latitude, longitude, address: locationAddress },
      severity,
      destruction_type,
      description,
      media: {
        text: description,
        image_url: req.files?.image ? `/uploads/${req.files.image[0].filename}` : null,
        audio_transcription: audioTranscription
      },
    
    });

    await report.save();
    res.json({ success: true, report });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

app.post("/analyze-image", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
    }

    try {
        // Set request headers
        const headers = {
            "Ocp-Apim-Subscription-Key": API_KEY,
            "Content-Type": "application/octet-stream"
        };

        // Send request to Azure Vision API
        const response = await axios.post(url, req.file.buffer, { headers });
        
        const data = response.data;
        let captions = [];
        if (data.denseCaptionsResult && data.denseCaptionsResult.values) {
            captions = data.denseCaptionsResult.values.map(item => ({
                text: item.text,
                confidence: item.confidence.toFixed(2)
            }));
        }

        res.json({ captions });
        const respon = captions.map(caption => caption.text).join("\n")
        console.log(respon)
        // console.log(captions.map(caption => caption.text).join("\n"));
    } catch (error) {
        console.error("Error making API request:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error processing image" });
    }
});

// Azure AI Search Configuration
// const AZURE_SEARCH_SERVICE = process.env.AZURE_SEARCH_SERVICE;
// const AZURE_SEARCH_INDEX = process.env.AZURE_SEARCH_INDEX;
// const AZURE_SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY;

// app.get("/get-labels", async (req, res) => {
//     try {
//         // Azure AI Search API Endpoint
//         const url = `https://${AZURE_SEARCH_SERVICE}.search.windows.net/indexes/${AZURE_SEARCH_INDEX}/docs?api-version=2023-07-01-Preview&$select=label`;

//         // API Request Headers
//         const headers = {
//             "Content-Type": "application/json",
//             "api-key": AZURE_SEARCH_API_KEY,
//         };

//         // Fetch Data from Azure Search
//         const response = await axios.get(url, { headers });

//         // Extract labels from results
//         const labels = response.data.value.map(doc => doc.label);

//         res.json({ labels });
//     } catch (error) {
//         console.error("Error fetching labels:", error);
//         res.status(500).json({ error: "Failed to retrieve labels" });
//     }
// });
// // Endpoint to handle audio file upload and speech-to-text processing
// // Azure Speech Config
// const speechConfig = sdk.SpeechConfig.fromSubscription(
//   AZURE_SPEECH_KEY,
//   AZURE_SPEECH_REGION
// );
// speechConfig.speechRecognitionLanguage = "en-US";

// // Increase initial silence timeout (default is too short)
// speechConfig.setProperty(
//   sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
//   "5000" // 5 seconds
// );

// Route to handle audio file uploads
app.post("/upload-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    console.log("Uploaded File Details:", req.file);

    // Save and debug the received audio file
    const debugFilePath = "debug_audio.wav";
    fs.writeFileSync(debugFilePath, req.file.buffer);
    console.log(`Saved debug audio file: ${debugFilePath}`);

    // Check if the file is not empty
    if (req.file.size === 0) {
      return res.status(400).send("Uploaded file is empty.");
    }

    // Create an AudioConfig using the buffer
    const audioConfig = sdk.AudioConfig.fromWavFileInput(req.file.buffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    console.log("Recognizing Speech...");

    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          console.log("Recognized Text:", result.text);
          res.json({ text: result.text });
        } else {
          console.error("Speech recognition failed:", result);
          res.status(400).json({ error: "Speech recognition failed", details: result });
        }
      },
      (err) => {
        console.error("Error during recognition:", err);
        res.status(500).json({ error: "Error recognizing speech", details: err });
      }
    );
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Endpoint to connect to Microsoft Immersive Reader
app.post("/immersive-reader", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.IMMERSIVE_READER_CLIENT_ID,
        client_secret: process.env.IMMERSIVE_READER_CLIENT_SECRET,
        scope: "https://cognitiveservices.azure.com/.default",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const token = tokenResponse.data.access_token;

    res.json({
      token,
      subdomain: process.env.IMMERSIVE_READER_SUBDOMAIN,
      text,
    });
  } catch (error) {
    console.error("Error connecting to Immersive Reader:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to connect to Immersive Reader" });
  }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
