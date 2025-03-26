const getAccessToken = async () => {
  const API_URL = `https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.VideoIndexer/accounts/${ACCOUNT_NAME}/generateAccessToken?api-version=2025-01-01`;

  try {
    const response = await axios.post(
      API_URL,
      {
        permissionType: "Contributor",
        scope: "Account",
      },
      {
        headers: {
          Authorization: `Bearer ${AZURE_AUTH_TOKEN}`, // If required for Azure Management API
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Access Token:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error generating access token:",
      error.response?.data || error.message
    );
    throw error;
  }
};
