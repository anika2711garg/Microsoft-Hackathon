import dotenv from "dotenv";
import axios from "axios";
import { get } from "mongoose";

dotenv.config();

const SUBSCRIPTION_ID = process.env.AZURE_VIDEO_INDEXER_API_KEY;
const RESOURCE_GROUP = process.env.AZURE_RESOURCE_GROUP;
const ACCOUNT_NAME = process.env.ACCOUNT_NAME;
const AZURE_AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSIsImtpZCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kZDA5NmUyMi1lYjJkLTRiYTgtYTlmMy0yMTlmZjJhODYzMjIvIiwiaWF0IjoxNzQzMDMzMTk2LCJuYmYiOjE3NDMwMzMxOTYsImV4cCI6MTc0MzAzNzk0MiwiYWNyIjoiMSIsImFpbyI6IkFaUUFhLzhaQUFBQUZxakVwMjNCdEZSQ2MwMGlsMGxIdkZtclBrYzYwRm5HdDd5QStaeTcvd3pZR0FtYUlkOXpYd3FzOTZobytKUGpKeXhmQ1Y4cGYxMG0xWmNNS3dyOWFLeU9keldMdU0vTU4vMDJiSUdrRW5jajd5Q0Q1Rys5OGNHN1lBVlBvY3M0Y0xDV3FQMS9GUEloNm1YMXBLVFZIYXVCc042SDRZck9TTkIyRFIxcXM2OUszcVNmSW9lZFpKQllQeFlkTlc2dyIsImFsdHNlY2lkIjoiMTpsaXZlLmNvbTowMDAzQkZGRDc1QjlGNjQ5IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6ImI2NzdjMjkwLWNmNGItNGE4ZS1hNjBlLTkxYmE2NTBhNGFiZSIsImFwcGlkYWNyIjoiMCIsImVtYWlsIjoieXNoaXZoYXJlMTYzQG91dGxvb2suY29tIiwiZmFtaWx5X25hbWUiOiJTaGl2aGFyZSIsImdpdmVuX25hbWUiOiJZYXRoYXJ0aCIsImdyb3VwcyI6WyIwNmNiNjBhNy1lNDA1LTQ3MWItYWE1NC1iNmQxYjQyOGIxMzYiXSwiaWRwIjoibGl2ZS5jb20iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI0OS40My4zMy4yNDAiLCJuYW1lIjoiWWF0aGFydGggU2hpdmhhcmUiLCJvaWQiOiJhMGI5MmU1OC1hNjU1LTQ2YzMtODBkNC0yOTk1ZGQ4ZjE3NzUiLCJwdWlkIjoiMTAwMzIwMDM1REE5MDJBNiIsInJoIjoiMS5BU3NBSW00SjNTM3JxRXVwOHlHZjhxaGpJa1pJZjNrQXV0ZFB1a1Bhd2ZqMk1CUENBR29yQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiMDAyZmYxODktNDM5NC0xMGE0LWZjOGUtNjk1NWFiYTdhOGY0Iiwic3ViIjoiYkI4YWJaZDJHa2JPN2d1OTNxaUc1TmQtU2Y3ZzJTQjBiMFZrRkk0enZ4MCIsInRpZCI6ImRkMDk2ZTIyLWViMmQtNGJhOC1hOWYzLTIxOWZmMmE4NjMyMiIsInVuaXF1ZV9uYW1lIjoibGl2ZS5jb20jeXNoaXZoYXJlMTYzQG91dGxvb2suY29tIiwidXRpIjoiZ2xqMnJQYnFJa3EzNnpVR240RWZBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19lZG92Ijp0cnVlLCJ4bXNfaWRyZWwiOiI4IDEiLCJ4bXNfdGNkdCI6MTcwOTY3MTc4OX0.VWvrb96R6YmNsS6PJ-xLK3BXwTZtELBv_DU_TtdEYeMDpKvF09YZ5-xh5ejg7NXFDL4PtsXJWk4G984SzL22LSU80ue5X3NdGO4YGabyYA9d9xJ4a3CwyR3I9GjcUvqdd9fRcj6IeHmoAhDtjOLAIRV2WlJ0PW-PRSFQdivMYLlZr_dt9MUrgLQIipNTraqCZOi3Om7ECCz8chtrgS1uZ0UEXOwXv7sT80dYZOWmHUNQmtrFs6rJp55b2dtLveRrug2GDc9wCdky2_jYYZaGkroLT7GJz9buZ-RcYLUNsJJE7A8xvZlg4sAEW87xTL9edmmPnXTkTSTDsaFPzNpYHw";
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