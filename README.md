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
git clone https://github.com/anika2711garg/Microsoft-Hackathon.git
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

## Overview of Web App

### System Design :
![System_Design](https://github.com/user-attachments/assets/e8d85624-7609-4463-8f2b-c45f1777f070)
### Home :
![file_2025-03-28_16 28 22](https://github.com/user-attachments/assets/6beb43a5-8acb-4aec-bf51-ab7cd7d3637b)
### About : 
![file_2025-03-28_16 28 46](https://github.com/user-attachments/assets/de03806c-8528-48ef-baaa-1863db7908d9)
![file_2025-03-28_16 28 58](https://github.com/user-attachments/assets/6eb16508-2ed8-499c-93b0-3ba429c60818)
### Report :
![file_2025-03-28_16 30 00](https://github.com/user-attachments/assets/4079129e-1bd7-4393-a9ba-2a21853f9f1a)
![file_2025-03-28_16 30 11](https://github.com/user-attachments/assets/dc1bd40a-1bdd-4b32-8ee5-2e78bc187926)
### Insights :
![file_2025-03-28_16 27 30](https://github.com/user-attachments/assets/06a55228-f1e1-4ecc-abe3-51c829eac73a)
![file_2025-03-28_16 27 54](https://github.com/user-attachments/assets/96c13346-7049-4676-b659-4192c09ad82a)
### Notifications : 
![file_2025-03-28_16 29 15](https://github.com/user-attachments/assets/1a125907-eb9a-4d07-9736-ff12ccd3fc57)
### Maps :
![file_2025-03-28_16 30 33](https://github.com/user-attachments/assets/0d452ae5-f2de-4355-860f-bfcc70c65f25)
![file_2025-03-28_16 30 53](https://github.com/user-attachments/assets/1e02e267-2e27-40f2-b642-42d9abe44b04)
### Dashboard :
![file_2025-03-28_16 31 25](https://github.com/user-attachments/assets/771e6dff-890b-4cac-bda5-a4ed1845673a)
![file_2025-03-28_16 31 40](https://github.com/user-attachments/assets/83e132df-b19a-4c28-8103-611d4c12e313)
### Email :
![WhatsApp Image 2025-03-28 at 22 54 05_f6b44a47](https://github.com/user-attachments/assets/f55926f3-f7ef-4515-95ca-441194c458af)


## Contributors ✨
- [Yatharth Shivhare](https://github.com/Jarvisss1)
- [Ansh Gupta](https://github.com/anshkie)
- [Anika Garg](https://github.com/anika2711garg)
- [Malaika Varshney](https://github.com/malaikashinchan)
- [Rajan Patel](https://github.com/Rajan093)
