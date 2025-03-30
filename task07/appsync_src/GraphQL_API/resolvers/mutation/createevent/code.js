import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached data source
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const eventId = util.autoId();
    const createdAt = util.time.nowISO8601();
    ctx.stash['event_id'] = eventId;  // Storing the generated ID for use in the response mapping
    return {
        operation: "PutItem",
        key: {
            "id": { "S": eventId }
        },
        attributeValues: {
            "userId": { "N": ctx.args.userId.toString() },
            "createdAt": { "S": createdAt },
            "payLoad": { "S": ctx.args.payLoad }
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

    const event = {
        id: ctx.stash['event_id'],
        userId: ctx.args.userId,
        createdAt: util.time.nowISO8601(),
        payLoad: ctx.args.payLoad
    };
    return event;
}
