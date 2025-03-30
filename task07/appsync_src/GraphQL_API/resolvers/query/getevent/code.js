import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    // Using the provided ID to fetch the item
    return {
        operation: "GetItem",
        key: {
            "id": { "S": ctx.args.id }
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
        return util.error(ctx.error.message, ctx.error.type);
    }

    if (!ctx.result || !ctx.result.id) {
        return util.error("Event not found.", "NotFoundError");
    }

    
    const event = {
        id: ctx.result.id.S,
        userId: parseInt(ctx.result.userId.N, 10),
        createdAt: ctx.result.createdAt.S,
        payLoad: JSON.parse(ctx.result.payLoad.S)  // Ensure payLoad is parsed from string
    };
    return event;
}
