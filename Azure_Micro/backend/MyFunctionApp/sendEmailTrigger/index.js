const { EmailClient } = require("@azure/communication-email");
const { TableClient } = require("@azure/data-tables");
require("dotenv").config();

module.exports = async function (context, req) {
    // Handle CORS and Preflight Requests
    if (req.method === "OPTIONS") {
        context.res = {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS, POST",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            body: { message: "Email sent successfully" }
        };
        return;
    }

    try {
        // Ensure request body is parsed
        const body = req.body || JSON.parse(req.rawBody || "{}");
        console.log("Received request:", req.body);
        // Extract disaster report details
        const { reporterName, location, disasterType, description } = body;

        if (!reporterName || !location || !disasterType || !description) {
            context.res = {
                status: 400,
                body: { success: false, message: "Missing required fields." }
            };
            return;
        }

        // Azure Communication Services Email Configuration
        const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
        const emailClient = new EmailClient(connectionString);

        // Email details
        const emailMessage = {
            senderAddress: "DoNotReply@eb41ba9b-8e3e-4a28-be4b-27cc77a74414.azurecomm.net",
            content: {
                subject: `Disaster Report: ${disasterType} at ${location}`,
                plainText: `A disaster has been reported.\n\nReporter: ${reporterName}\nLocation: ${location}\nType: ${disasterType}\nDescription: ${description}`,
                html: `<h2>Disaster Alert</h2>
                       <p><strong>Reporter:</strong> ${reporterName}</p>
                       <p><strong>Location:</strong> ${location}</p>
                       <p><strong>Type:</strong> ${disasterType}</p>
                       <p><strong>Description:</strong> ${description}</p>`
            },
            recipients: {
                to: [
                    { address: "anshnew41@gmail.com" },  // Change to authorities' emails
                    { address: "anshgup444@gmail.com" }
                ]
            }
        };

        // Send Email
        let emailSendOperation; // Declare emailSendOperation in the outer scope
        try {
            
            emailSendOperation = await emailClient.beginSend(emailMessage);
            console.log("Email operation initiated:", emailSendOperation);
    
            // 🔥 Polling for email status
            const result = await emailSendOperation.pollUntilDone();
            console.log("Email sent successfully:", result);
        } catch (error) {
            console.error("Error sending email:", error);
        }
        const tableClient = TableClient.fromConnectionString(
            process.env.AZURE_STORAGE_CONNECTION_STRING,
            "Notifications"
        );
        console.log(process.env.AZURE_STORAGE_CONNECTION_STRING)
        await tableClient.createEntity({
            partitionKey: "DisasterReports",
            rowKey: new Date().toISOString(),
            reporterName,
            location,
            disasterType,
            description,
            status: "sent",
            timestamp: new Date().toISOString()
        });

        console.log("Email sent successfully:", emailSendOperation);
        // Return Success Response
        context.res = {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:5173",
            },
            body: { success: true, operationId: emailSendOperation.id }
        };
    } catch (error) {
        console.error("Error sending email:", error);
        context.res = {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:5173",
            },
            body: { success: false, error: error.message }
        };
    }
};
