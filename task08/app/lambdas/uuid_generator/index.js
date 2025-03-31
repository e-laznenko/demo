const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.s3_bucket;

exports.handler = async (event) => {
    try {
        // Generate 10 UUIDs
        const uuids = Array.from({ length: 10 }, () => uuid.v4());

        // Get current ISO timestamp
        const timestamp = new Date().toISOString();
        const fileName = `${timestamp}.json`;

        // Prepare the file content
        const fileContent = JSON.stringify({ ids: uuids }, null, 2);

        // Upload the file to S3
        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
            ContentType: "application/json"
        }).promise();

        console.log(`File ${fileName} created successfully.`);
        return { message: "File created", fileName };
    } catch (error) {
        console.error("Error creating file:", error);
        return { error: "Failed to create file" };
    }
};
