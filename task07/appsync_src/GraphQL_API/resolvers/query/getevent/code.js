import { util } from '@aws-appsync/utils';
/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    // Storing the ID for use in the response mapping
    ctx.stash['event_id'] = ctx.args.id;
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

    // Return the event data
    const event = {
        id: ctx.result.id.S,
        name: ctx.result.name.S,
        date: ctx.result.date.S
    };
    return event;
}
