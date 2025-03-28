import dotenv from "dotenv";
import axios from "axios";
import { get } from "mongoose";

dotenv.config();

const SUBSCRIPTION_ID = process.env.AZURE_VIDEO_INDEXER_API_KEY;
const RESOURCE_GROUP = process.env.AZURE_RESOURCE_GROUP;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const AZURE_AUTH_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJWZXJzaW9uIjoiMi4wLjAuMCIsIktleVZlcnNpb24iOiI3NTExMjE1MGMzNDg0ZjI1ODdhNGFiMWE2OTMyMjE1OCIsIkFjY291bnRJZCI6IjQzOGNkYTVhLTI1MWYtNGMxNy04NDE1LWQ5NTc5YWMzNzhiMCIsIkFjY291bnRUeXBlIjoiQXJtIiwiUGVybWlzc2lvbiI6IkNvbnRyaWJ1dG9yIiwiRXh0ZXJuYWxVc2VySWQiOiJBMEI5MkU1OEE2NTU0NkMzODBENDI5OTVERDhGMTc3NSIsIlVzZXJUeXBlIjoiTWljcm9zb2Z0Q29ycEFhZCIsIklzc3VlckxvY2F0aW9uIjoiZWFzdHVzIiwibmJmIjoxNzQzMTUyOTcxLCJleHAiOjE3NDMxNTY4NzEsImlzcyI6Imh0dHBzOi8vYXBpLnZpZGVvaW5kZXhlci5haS8iLCJhdWQiOiJodHRwczovL2FwaS52aWRlb2luZGV4ZXIuYWkvIn0.cdkGJLWfs2mT49meHzccF31NuwEF8DD0GlEHGluC4Swn3XQeayE082jI76P48j7BhBiGdR0VOm8IvnNrjQg_x-FBUHaQ7056X7w_y10Jsh0iJgOzFbvqiqiQzGecjlhEsrAN_pJe3OJ8Hy4Lc3XMcjkk-1TTzr4fhn4WSUPWpuh8lN4b2L_FSekGfB1xzJYIa1uuys4HN2IrINcdgJNMGP-EjqoqgIemmDUoqEqXCW4OiguabdLy7qrmUIjgGPYCXWY_NYc9S0bz92OSJ8ldmV6eLznrHG4Wv4e5aFtEkzxG6g5xCbpwoxumAu6qWCs4VBguC3jLmeIbUA4lRf5k2g";

// console.log("AZURE_AUTH_TOKEN", AZURE_AUTH_TOKEN);


const getAccessToken = async () => {
  const API_URL = `https://management.azure.com/subscriptions/cafee043-0ec8-44e5-91ab-65a1afad5a91/resourceGroups/disaster-reporter/providers/Microsoft.VideoIndexer/accounts/disaster/generateAccessToken?api-version=2025-01-01`;

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
    console.log(
      "--------------------------------------------------------------------------------------------------------"
    );
    console.log("Access Token:", response.data.accessToken);
    console.log("--------------------------------------------------------------------------------------------------------" );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating access token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

getAccessToken();