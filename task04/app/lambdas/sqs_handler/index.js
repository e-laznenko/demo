exports.handler = async (event) => {
    console.log("Received SQS event:", JSON.stringify(event, null, 2));

    event.Records.forEach(record => {
        console.log("Message ID:", record.messageId);
        console.log("Message Body:", record.body);
    });

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda'),
    };
    return response;
};
