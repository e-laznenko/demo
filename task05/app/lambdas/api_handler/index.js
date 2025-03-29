const AWS = require('aws-sdk');
const uuid = require('uuid');

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// The Lambda function handler
exports.handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));
        // Parse the incoming request body
        const requestBody = JSON.parse(event.body);

        // Create an event object
        const newEvent = {
            id: uuid.v4(), // Generate a UUID for the event ID
            principalId: requestBody.principalId,
            createdAt: new Date().toISOString(),
            body: requestBody.content, // Store content as the body of the event
        };

        const tableName =  process.env.target_table;

        // Save event to DynamoDB
        const params = {
            TableName: tableName, 
            Item: newEvent,
        };

        console.log("Using DynamoDB table:", process.env.target_table);
        console.log("EVENT", newEvent);

        await dynamoDB.put(params).promise(); // Save the event to DynamoDB

        // Return the created event as the response
        return {
            statusCode: 201,
            body: JSON.stringify({
                event: newEvent,
            }),
        };
    } catch (error) {
        console.error('Error creating event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating event' }),
        };
    }
};
