export async function convertAudioWithBlob(
  apiKey: string,
  audioBlob: Blob,
  targetFormat: string,
  options = {}
): Promise<Blob> {
  const apiEndpoint = "https://api.api2convert.com/v2/jobs";

  // Create a temporary URL from the blob
  const blobUrl = URL.createObjectURL(audioBlob);
  console.log("Blob URL:", blobUrl);

  const requestBody = {
    input: [
      {
        type: "remote", // Use "remote" for URLs or "upload" if you directly upload files
        source: blobUrl, // Temporary blob URL
      },
    ],
    conversion: [
      {
        category: "audio",
        target: targetFormat, // Desired format, e.g., "wav"
        options:{ "allow_multiple_outputs": true}, // Additional conversion options
      },
    ],
  };

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        ...(apiKey && { "X-Oc-Api-Key": apiKey }),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Revoke the temporary blob URL to free memory
    URL.revokeObjectURL(blobUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Conversion Job Created:", result);

    if (!result.output || !result.output[0]?.uri) {
      throw new Error("Invalid conversion output from the API.");
    }

    // Fetch the converted file from the API result URI
    const convertedFileResponse = await fetch(result.output[0].uri);
    if (!convertedFileResponse.ok) {
      throw new Error(
        `Failed to download converted file: ${convertedFileResponse.statusText}`
      );
    }

    // Convert the response to a Blob
    const convertedAudioBlob = await convertedFileResponse.blob();
    return convertedAudioBlob;
  } catch (error) {
    console.error("Conversion failed:", error);
    throw error;
  }
}
