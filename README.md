# 🌍 CrisisConnect 🚨

## Overview
The Disaster Management System is a cloud-based platform that allows users to report disasters efficiently. It leverages various Azure services to analyze, process, and notify relevant authorities in real-time.

## Features 🌟
- **📹 Video Analysis**: Uses Azure AI Video Indexer to extract insights from uploaded videos.
- **🖼️ Image Captioning**: Employs Azure Computer Vision Services to generate multiple captions for images.
- **🎙️ Speech Processing**: Utilizes Azure Speech Services to transcribe recorded audio.
- **☁️ Cloud Storage**: Stores videos, images, and reports using Azure Storage Blob.
- **📧 Email Notifications**: Sends trigger messages to local authorities via Azure Communication Email Services.
- **📍 Geolocation Services**: Uses Azure Maps to pinpoint disaster locations and Azure Reverse Geocoding to fetch addresses from latitude and longitude.
- **📝 Incident Logging**: Stores disaster reports and metadata in Azure Storage Tables.
- **⚙️ Automated Triggers**: Uses Azure Functions to process and notify relevant entities when a report is submitted.

## Technologies Used 🔧
- **Frontend**: React with Tailwind CSS
- **Backend**: Azure Functions
- **Database**: Azure Storage Accounts (Tables & Blobs)
- **Cloud Services**: Azure AI, Azure Maps, Azure Storage, Azure Communication Services

## Azure Services Utilized ☁️
| Service | Purpose |
|---------|---------|
| Azure AI Video Indexer | Extracts insights from uploaded videos |
| Azure Storage Blob | Stores videos, images, and disaster reports |
| Azure Computer Vision | Generates captions for uploaded images |
| Azure Speech Services | Transcribes audio from voice recordings |
| Azure Communication Services | Sends notification emails to authorities |
| Azure Functions | Automates trigger-based workflows |
| Azure Storage Accounts | Stores structured data related to incidents |
| Azure Maps | Pinpoints the location of disasters |
| Azure Reverse Geocoding | Converts latitude and longitude into readable addresses |

## Installation & Setup 🚀

### 1. Clone the Repository 🖥️
```bash
git clone https://github.com/your-repo/disaster-management.git
cd disaster-management
```

---

### 2. Frontend Setup 💻
Navigate to the frontend directory and install dependencies:
```bash
cd Azure_Micro/frontend
npm install
```

---

### 3. Backend Setup 🔙
Navigate to the backend directory and install dependencies:
```bash
cd ../backend
npm install
```

#### Install FFmpeg 🎥
- **For Windows**:
  Download FFmpeg from [this link](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl-shared.zip).

- **For Other OS**:
  Check installation details [here](https://www.ffmpeg.org/download.html).

#### Steps to Configure FFmpeg:
1. Extract the downloaded file.
2. Add the path to the `bin` folder in your system's environment variables.
3. Open `Azure_Micro/backend/app.js` and set the FFmpeg path in the code:
   
   ```javascript
   ffmpeg.setFfmpegPath("D:/path/to/your/ffmpeg-bin-folder/ffmpeg.exe");
   ```
---

### 4. Set Up Azure Services ☁️
1. Create an Azure Storage Account.
2. Enable Azure AI Video Indexer.
3. Configure Azure Communication Services for email notifications.
4. Set up Azure Maps API for location tracking.
5. Enable Azure Computer Vision and Speech Services.
6. Deploy Azure Functions for automated triggers.

---

### 5. **Install Azure Functions Core Tools** ⚡
Install the Azure Functions Core Tools CLI to run Azure Functions locally:
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### 6. Running the Web Application 🌐

#### For Frontend:
```bash
cd Azure_Micro/frontend
npm run dev
```

#### For Backend:
```bash
cd ../backend
nodemon app.js
```

---

### 7. Running Azure Functions ⚙️
Navigate to the Azure Functions directory and start the function:
```bash
cd MyFunctionApp  # Located in Azure_Micro/backend/MyFunctionApp
func start
```
## Usage 📋
1. Users report an incident by filling in the form with disaster type, severity, affected people, and additional details.
2. The system captures the latitude and longitude and fetches the address using Azure Reverse Geocoding.
3. Uploaded images are processed with Azure Computer Vision to generate captions.
4. Videos are analyzed using Azure AI Video Indexer to extract insights.
5. Audio recordings are transcribed using Azure Speech Services.
6. Data is stored in Azure Storage (Blobs & Tables) and a notification email is sent to local authorities.
7. Authorities can review the reports and take necessary action.

## Commands & Tools Used 🛠️
| Command | Description |
|---------|-------------|
| `npm install` | Installs required dependencies |
| `npm start` | Starts the development server |
| `npm run build` | Builds the project for production |
| `az storage account create` | Creates an Azure Storage Account |
| `az functionapp create` | Deploys an Azure Function |
| `az maps account create` | Sets up Azure Maps API |

## Contributors ✨
- [Yatharth Shivhare](https://github.com/Jarvisss1)
- [Ansh Gupta](https://github.com/anshkie)
- [Anika Garg](https://github.com/anika2711garg)
