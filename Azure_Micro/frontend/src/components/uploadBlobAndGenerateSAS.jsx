const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const accountName = "<your-account-name>"; // Replace with your Azure Blob Storage account name
const accountKey = "<your-account-key>"; // Replace with your Azure Blob Storage account key
const containerName = "uploadvids"; // Container name
const blobName = "example-video.mp4"; // Replace with your file name
const localFilePath = "<path-to-your-local-file>"; // Local file path to upload

async function uploadBlobAndGenerateSAS() {
  try {
    // Create a Blob Service Client
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    // Get a container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists({ access: "container" });
    console.log(`Container "${containerName}" is ready.`);

    // Upload the blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(localFilePath);
    console.log(`Blob "${blobName}" uploaded successfully.`);

    // Generate SAS Token
    const sasOptions = {
      containerName: containerName,
      blobName: blobName,
      permissions: BlobSASPermissions.parse("r"), // Read-only permissions
      startsOn: new Date(), // Start time
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expiry time (1 hour from now)
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();

    // Generate public URL with SAS token
    const sasUrl = `${blockBlobClient.url}?${sasToken}`;
    console.log(`SAS URL: ${sasUrl}`);
    return sasUrl;
  } catch (error) {
    console.error("Error generating SAS token or uploading blob:", error);
  }
}

// Call the function
uploadBlobAndGenerateSAS();
