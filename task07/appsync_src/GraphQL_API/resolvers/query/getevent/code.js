import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    return {
        operation: "GetItem",  // Fetch an item from the data source
        key: {
            "id": { "S": ctx.args.id }  // Use provided event ID to fetch data
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
        return util.error(ctx.error.message, ctx.error.type);  // Handle errors
    }

    // Check if the event was found
    if (!ctx.result || !ctx.result.id) {
        return util.error("Event not found.", "NotFoundError");  // Handle event not found
    }

    // Return the event data (ensure types are correctly mapped)
    const event = {
        id: ctx.result.id.S,  // Extract ID from the result
        userId: parseInt(ctx.result.userId.N, 10),  // Parse userId as an integer
        createdAt: ctx.result.createdAt.S,  // Extract creation timestamp
        payLoad: JSON.parse(ctx.result.payLoad.S)  // Parse payload as JSON
    };
    return event;
}
