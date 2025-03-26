exports.handler = async (event) => {
    console.log("Received SNS event:", JSON.stringify(event, null, 2));

    // Loop through records (multiple messages can be received in one event)
    event.Records.forEach(record => {
        console.log("Message ID:", record.Sns.MessageId);
        console.log("Message Body:", record.Sns.Message);
    });

    return {
        statusCode: 200,
        body: "SNS message processed successfully"
    };
};
