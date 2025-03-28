const { TableClient } = require("@azure/data-tables");
require("dotenv").config();

module.exports = async function (context, req) {
  try {
    console.log(
      "Connection String:",
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );

    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error(
        "AZURE_STORAGE_CONNECTION_STRING is missing or undefined."
      );
    }

    const tableClient = TableClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
      "Notifications"
    );

    let notifications = [];
    for await (const entity of tableClient.listEntities()) {
      notifications.push({
        id: entity.rowKey,
        reporterName: entity.reporterName,
        location: entity.location,
        disasterType: entity.disasterType,
        description: entity.description,
        status: entity.status,
        timestamp: new Date(entity.timestamp), // Ensure the timestamp is parsed as a Date object
      });
    }

    // Sort by timestamp in descending order and take the top 5
    const recentNotifications = notifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    console.log("Recent Notifications:", recentNotifications);
    context.res = {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "http://localhost:5173" },
      body: { success: true, notifications: recentNotifications },
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    context.res = {
      status: 500,
      body: { success: false, error: error.message },
    };
  }
};
