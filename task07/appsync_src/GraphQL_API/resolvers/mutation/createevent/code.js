import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const eventId = util.autoId();  // Generate a new unique ID
    const createdAt = util.time.nowISO8601();  // Get current timestamp in ISO 8601 format
    ctx.stash['event_id'] = eventId;  // Store the generated ID in stash for later use
    return {
        operation: "PutItem",
        key: {
            "id": { "S": eventId }  // Set ID of the new event
        },
        attributeValues: {
            "userId": { "N": ctx.args.userId.toString() },  // Ensure userId is in number format
            "createdAt": { "S": createdAt },  // Store the creation timestamp
            "payLoad": { "S": ctx.args.payLoad }  // Store payload data
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
        return util.error(ctx.error.message, ctx.error.type);  // Return error if there is one
    }

    // Return the created event with the ID and createdAt values
    const event = {
        id: ctx.stash['event_id'],  // Retrieved from stash
        userId: ctx.args.userId,  // User ID from the request
        createdAt: util.time.nowISO8601(),  // Current timestamp for event creation
        payLoad: ctx.args.payLoad  // Payload from the request
    };
    return event;
}
