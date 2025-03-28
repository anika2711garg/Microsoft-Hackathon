import dotenv from "dotenv";
import axios from "axios";
import { get } from "mongoose";

dotenv.config();

const SUBSCRIPTION_ID = process.env.AZURE_VIDEO_INDEXER_API_KEY;
const RESOURCE_GROUP = process.env.AZURE_RESOURCE_GROUP;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const AZURE_AUTH_TOKEN = 
"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSIsImtpZCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kZDA5NmUyMi1lYjJkLTRiYTgtYTlmMy0yMTlmZjJhODYzMjIvIiwiaWF0IjoxNzQzMTE4NDM0LCJuYmYiOjE3NDMxMTg0MzQsImV4cCI6MTc0MzEyMzU4OCwiYWNyIjoiMSIsImFpbyI6IkFaUUFhLzhaQUFBQUE4dmhwQUFlU3VBTE9xSVBIeW54ekVQRDdOOWY3dG4vQjUydDAzb3d2SEhpdTdZT3UrOVR3U3FGK2lxbzBoa3d0czNSdzBtd24xajlMY2pxaTk0UTUrT1JORFlpbjFqVkJRaEl1TGRmR1hjTmdMMndYQ29kUzBhQ1RPU3pEeVZqaHprOTJ5UzhHSkZsanV6STFvc2grb2xGYUlCbnA0Yy9BN3RZeFRBTzE0U0dvQlJKcDk1aDN3bWJBTG1YZE9KQSIsImFsdHNlY2lkIjoiMTpsaXZlLmNvbTowMDAzQkZGRDc1QjlGNjQ5IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6ImI2NzdjMjkwLWNmNGItNGE4ZS1hNjBlLTkxYmE2NTBhNGFiZSIsImFwcGlkYWNyIjoiMCIsImVtYWlsIjoieXNoaXZoYXJlMTYzQG91dGxvb2suY29tIiwiZmFtaWx5X25hbWUiOiJTaGl2aGFyZSIsImdpdmVuX25hbWUiOiJZYXRoYXJ0aCIsImdyb3VwcyI6WyIwNmNiNjBhNy1lNDA1LTQ3MWItYWE1NC1iNmQxYjQyOGIxMzYiXSwiaWRwIjoibGl2ZS5jb20iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI0OS40My4zMy4yNTEiLCJuYW1lIjoiWWF0aGFydGggU2hpdmhhcmUiLCJvaWQiOiJhMGI5MmU1OC1hNjU1LTQ2YzMtODBkNC0yOTk1ZGQ4ZjE3NzUiLCJwdWlkIjoiMTAwMzIwMDM1REE5MDJBNiIsInJoIjoiMS5BU3NBSW00SjNTM3JxRXVwOHlHZjhxaGpJa1pJZjNrQXV0ZFB1a1Bhd2ZqMk1CUENBR29yQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiMDAyZmYxODktNDM5NC0xMGE0LWZjOGUtNjk1NWFiYTdhOGY0Iiwic3ViIjoiYkI4YWJaZDJHa2JPN2d1OTNxaUc1TmQtU2Y3ZzJTQjBiMFZrRkk0enZ4MCIsInRpZCI6ImRkMDk2ZTIyLWViMmQtNGJhOC1hOWYzLTIxOWZmMmE4NjMyMiIsInVuaXF1ZV9uYW1lIjoibGl2ZS5jb20jeXNoaXZoYXJlMTYzQG91dGxvb2suY29tIiwidXRpIjoibjZVekJXaDR2MHF3YXJ4ZnlyNmlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19lZG92Ijp0cnVlLCJ4bXNfaWRyZWwiOiIxIDEwIiwieG1zX3RjZHQiOjE3MDk2NzE3ODl9.MIm-YjsOwDzIVl1GDRiBPSOJzkaE5OvclIklzbvGVigK9xkm9k_CjZOijvNGPeXkipEknfx_H1Ik045DOaqQABPnxBSOmAcLbGLfd8PiQ21-j7y0Nh8xwka0Qh94ze0gHwstHOnxls1h5NPklC-l32PYBIN-uCtM-FPw26D4fi9WoAfvEWan8omANLZViNZhx36reBB8UrmGPYXn6VvTkr12SnOLqiYbYilmX74i5lfo6im9dhF20mg8_6uxikwg77R4BqvYeN_qkUI8_b6L0lnxqlHNJR2VHO5-YJHLbbNFTQCsP2b9nU2zleU8EgTT2FLsjcEZGKeOcdf6Ko03Sw"

// console.log("AZURE_AUTH_TOKEN", AZURE_AUTH_TOKEN);


export const getAccessToken = async () => {
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