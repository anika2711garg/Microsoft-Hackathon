export async function convertAudioWithBlob(
  apiKey = process.env.VITE_AUDIO_CONVERSION_API_KEY,
  audioBlob = new Blob(),
  targetFormat = "wav",
  options = {}
) {
  const apiEndpoint = "https://api.api2convert.com/v2/jobs";

  // Create a temporary URL from the blob
  const blobUrl = URL.createObjectURL(audioBlob);

  const requestBody = {
    input: [
      {
        type: "remote", // Or "upload" if you directly upload files
        source: blobUrl, // Temporary blob URL
      },
    ],
    conversion: [
      {
        category: "audio",
        target: targetFormat, // Desired format, e.g., "wav"
        options: options, // Additional conversion options
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

    // Return the conversion result
    return result;
  } catch (error) {
    console.error("Conversion failed:", error);
  }
}
