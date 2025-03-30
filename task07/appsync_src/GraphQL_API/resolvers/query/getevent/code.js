import { util } from '@aws-appsync/utils';

export function request(ctx) {
    return {
        operation: "GetItem",  // Fetch an item from the data source
        key: {
            "id": { "S": ctx.args.id }  // Use provided event ID to fetch data
        }
    };
}

export function response(ctx) {
    if (ctx.error) {
        return util.error(ctx.error.message, ctx.error.type);  // Handle errors
    }

    // Check if the event was found
    if (!ctx.result || !ctx.result.id) {
        return util.error("Event not found.", "NotFoundError");  // Handle event not found
    }

    // Parse the payLoad field from a string to an object
    let payLoad = {};
    try {
        payLoad = JSON.parse(ctx.result.payLoad.S); // Ensure payLoad is parsed as a JSON object
    } catch (error) {
        return util.error("Invalid payLoad format.", "InvalidPayloadError");
    }

    // Return the event data (no need for parseInt or JSON.parse)
    const event = {
        id: ctx.result.id.S,  // Extract ID from the result
        userId: ctx.result.userId.N,  // No need for parseInt if stored as number in DynamoDB
        createdAt: ctx.result.createdAt.S,  // Extract creation timestamp
        payLoad: payLoad  
    };
    return event;
}
