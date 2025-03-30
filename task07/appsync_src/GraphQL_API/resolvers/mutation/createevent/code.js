import { util } from '@aws-appsync/utils';
/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const eventId = util.autoId();  // Generate a unique event ID
    const createdAt = util.time.nowISO8601();  // Capture the current timestamp in ISO8601 format

    ctx.stash['event_id'] = eventId;  // Storing the generated ID for use in the response mapping
    ctx.stash['createdAt'] = createdAt;  // Store the createdAt timestamp

    return {
        operation: "PutItem",  // Store the event in DynamoDB
        key: {
            "id": { "S": eventId }  // Using the event ID as the primary key
        },
        attributeValues: {
            "userId": { "N": ctx.args.userId.toString() },  // Convert userId to a string for DynamoDB
            "payLoad": { "S": JSON.stringify(ctx.args.payLoad) },  // Store the payLoad as a JSON string
            "createdAt": { "S": createdAt }  // Store the event creation timestamp
        }
    };
}

/**
 * Returns the resolver result
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
    if (ctx.error) {
        return util.error(ctx.error.message, ctx.error.type);  // Handle errors gracefully
    }

    // Return the created event with the generated ID and created timestamp
    const event = {
        id: ctx.stash['event_id'],  // Use the event ID generated in the request phase
        createdAt: ctx.stash['createdAt'],  // Return the createdAt timestamp
        userId: ctx.args.userId,  // Return the userId
        payLoad: ctx.args.payLoad  // Return the payLoad
    };

    return event;  // Return the newly created event
}
