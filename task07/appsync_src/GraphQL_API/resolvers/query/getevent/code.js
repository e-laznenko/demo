import { util } from '@aws-appsync/utils';
/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    // Storing the event ID for use in the response mapping
    ctx.stash['event_id'] = ctx.args.id;

    return {
        operation: "GetItem",
        key: {
            "id": { "S": ctx.args.id }  // Searching by event ID
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
        return util.error(ctx.error.message, ctx.error.type);  // Handle any errors
    }

    if (!ctx.result || !ctx.result.id) {
        return util.error("Event not found.", "NotFoundError");  // Event not found error
    }

    // Return the event data, ensuring the payLoad is parsed from the JSON string
    const event = {
        id: ctx.result.id.S,  // Event ID
        userId: parseInt(ctx.result.userId.N, 10),  // User ID (converted to integer)
        createdAt: ctx.result.createdAt.S,  // Event creation timestamp
        payLoad: JSON.parse(ctx.result.payLoad.S)  // Parsing the payLoad from JSON string
    };

    return event;
}
