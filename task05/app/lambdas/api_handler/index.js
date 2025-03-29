const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDBClient({ region: process.env.region});
const TABLE_NAME  = process.env.table_name;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        
        if (!body.principalId || !body.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields: principalId or content" }),
            };
        }

        // Generate event details
        const eventId = uuidv4();
        const timestamp = new Date().toISOString();

        // Prepare DynamoDB item
        const item = {
            id: { S: eventId },
            principalId: { N: body.principalId.toString() },
            createdAt: { S: timestamp },
            body: { S: JSON.stringify(body.content) },
        };

        // Save to DynamoDB
        await dynamoDB.send(new PutItemCommand({
            TableName: TABLE_NAME,
            Item: item,
        }));

        // Construct response event
        const createdEvent = {
            id: eventId,
            principalId: body.principalId,
            createdAt: timestamp,
            body: body.content,
        };

        return {
            statusCode: 201,
            body: JSON.stringify({ event: createdEvent }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
