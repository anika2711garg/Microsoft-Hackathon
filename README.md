# Disaster Management System

## Overview
The Disaster Management System is a cloud-based platform that allows users to report disasters efficiently. It leverages various Azure services to analyze, process, and notify relevant authorities in real-time.

## Features
- **Video Analysis**: Uses Azure AI Video Indexer to extract insights from uploaded videos.
- **Image Captioning**: Employs Azure Computer Vision Services to generate multiple captions for images.
- **Speech Processing**: Utilizes Azure Speech Services to transcribe recorded audio.
- **Cloud Storage**: Stores videos, images, and reports using Azure Storage Blob.
- **Email Notifications**: Sends trigger messages to local authorities via Azure Communication Email Services.
- **Geolocation Services**: Uses Azure Maps to pinpoint disaster locations and Azure Reverse Geocoding to fetch addresses from latitude and longitude.
- **Incident Logging**: Stores disaster reports and metadata in Azure Storage Tables.
- **Automated Triggers**: Uses Azure Functions to process and notify relevant entities when a report is submitted.

## Technologies Used
- **Frontend**: React with Tailwind CSS
- **Backend**: Azure Functions
- **Database**: Azure Storage Accounts (Tables & Blobs)
- **Cloud Services**: Azure AI, Azure Maps, Azure Storage, Azure Communication Services

## Azure Services Utilized
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

## Installation & Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/disaster-management.git
   cd disaster-management
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Azure Services**
   - Create an Azure Storage Account
   - Enable Azure AI Video Indexer
   - Configure Azure Communication Services for email notifications
   - Set up Azure Maps API for location tracking
   - Enable Azure Computer Vision and Speech Services
   - Deploy Azure Functions for automated triggers

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Deploy to Azure**
   - Build the project:
     ```bash
     npm run build
     ```
   - Deploy using Azure Static Web Apps or Azure App Service.

## Usage
1. Users report an incident by filling in the form with disaster type, severity, affected people, and additional details.
2. The system captures the latitude and longitude and fetches the address using Azure Reverse Geocoding.
3. Uploaded images are processed with Azure Computer Vision to generate captions.
4. Videos are analyzed using Azure AI Video Indexer to extract insights.
5. Audio recordings are transcribed using Azure Speech Services.
6. Data is stored in Azure Storage (Blobs & Tables) and a notification email is sent to local authorities.
7. Authorities can review the reports and take necessary action.

## Commands & Tools Used
| Command | Description |
|---------|-------------|
| `npm install` | Installs required dependencies |
| `npm start` | Starts the development server |
| `npm run build` | Builds the project for production |
| `az storage account create` | Creates an Azure Storage Account |
| `az functionapp create` | Deploys an Azure Function |
| `az maps account create` | Sets up Azure Maps API |

## Contributors
- [Your Name](https://github.com/your-profile)

## License
This project is licensed under the MIT License.

