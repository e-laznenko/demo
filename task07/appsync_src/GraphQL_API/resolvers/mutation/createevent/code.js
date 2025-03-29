import { util } from '@aws-appsync/utils';
/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const eventId = util.autoId();
    ctx.stash['event_id'] = eventId;  // Storing the generated ID for use in the response mapping
    return {
        operation: "PutItem",
        key: {
            "id": { "S": eventId }
        },
        attributeValues: {
            "name": { "S": ctx.args.name },
            "date": { "S": ctx.args.date }
        }
    };
}

/**
 * Returns the resolver result
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
    // Update with response logic
    if (ctx.error) {
        return util.error(ctx.error.message, ctx.error.type);
    }

    // Return the created event with the ID generated earlier
    const event = {
        id: ctx.stash['event_id'],
        name: ctx.args.name,
        date: ctx.args.date
    };
    return event;
}
