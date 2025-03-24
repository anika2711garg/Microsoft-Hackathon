
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const app = express();
const port = 3000;
const speech = require("microsoft-cognitiveservices-speech-sdk");
// const fs = require("fs");
// const sdk = require("microsoft-cognitiveservices-speech-sdk");
// Load environment variables
const API_KEY = process.env.AZURE_COMPUTER_VISION_KEY;
const ENDPOINT = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;
const MONGO_URI = process.env.MONGODB_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI, {

 
});
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
    console.error("Azure Vision Error:", error.response ? error.response.data : error.message);
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



// Report Submission API
app.post("/report", upload.fields([{ name: "image" }, { name: "audio" }]), async (req, res) => {
  try {
    const { severity, destruction_type, description, latitude, longitude } = req.body;

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
      location: { latitude, longitude },
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
