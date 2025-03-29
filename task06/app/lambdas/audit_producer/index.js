const AWS = require("aws-sdk");
const uuid = require('uuid');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const auditTableName = process.env.target_table;
    
    const auditRecords = [];
    
    for (const record of event.Records) {
        if (record.eventName === "INSERT") {
            // New item created
            const newItem = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
            auditRecords.push({
                id: uuid.v4(),
                itemKey: newItem.key,
                modificationTime: new Date().toISOString(),
                newValue: newItem,
            });
        } else if (record.eventName === "MODIFY") {
            // Item updated
            const oldItem = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
            const newItem = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
            
            if (oldItem.value !== newItem.value) {
                auditRecords.push({
                    id: uuid.v4(),
                    itemKey: newItem.key,
                    modificationTime: new Date().toISOString(),
                    updatedAttribute: "value",
                    oldValue: oldItem.value,
                    newValue: newItem.value,
                });
            }
        }
    }
    
    // Store audit logs in DynamoDB
    try {
        for (const record of auditRecords) {
            await dynamoDB.put({
                TableName: auditTableName,
                Item: record,
            }).promise();
        }
        console.log("Audit records successfully written.");
    } catch (error) {
        console.error("Error writing to audit table:", error);
    }
};
