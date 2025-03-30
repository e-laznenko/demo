import { util } from '@aws-appsync/utils';

export function request(ctx) {
    const eventId = util.autoId();
    ctx.stash['event_id'] = eventId;  // Storing the generated ID for use in the response mapping
    const payLoadString = JSON.stringify(ctx.args.payLoad);
    const createdAt = util.time.nowISO8601();  // Ensure proper ISO8601 formatting

    // const createdAt = new Date().toISOString();

    ctx.stash['createdAt'] = createdAt;  // Storing the createdAt timestamp for use in the response mapping

    return {
        operation: "PutItem",
        key: {
            "id": { "S": eventId }
        },
        attributeValues: {
            "userId": { "N": ctx.args.userId },
            "createdAt": { "S": createdAt },
            "payLoad": { "S": payLoadString }
        }
    };
}


export function response(ctx) {
    if (ctx.error) {
        return util.error(ctx.error.message, ctx.error.type);
    }

    const event = {
        id: ctx.stash['event_id'],
        userId: ctx.args.userId,
        createdAt: ctx.stash['createdAt'],
        payLoad: ctx.args.payLoad
    };
    return event;
}