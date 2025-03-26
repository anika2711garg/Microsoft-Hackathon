import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getAzureAuthToken = async () => {
//   const TENANT_ID = process.env.TENANT_ID;
  const TENANT_ID = "dd096e22-eb2d-4ba8-a9f3-219ff2a86322";
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET_VALUE;
  const RESOURCE = "https://management.azure.com/";

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: RESOURCE + ".default",
      })
    );

    console.log("Azure Auth Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching Azure Auth Token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

getAzureAuthToken();
