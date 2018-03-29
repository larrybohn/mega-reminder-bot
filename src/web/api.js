import Router from 'koa-router';
import Reminder from '../model/Reminder';
import AuthTokenProvider from '../dal/auth-token-provider';
import ReminderProvider from '../dal/reminder-provider';

const authTokenProvider = new AuthTokenProvider(); //todo: fix with the right connection string
const reminderProvider = new ReminderProvider();

const api = new Router();

function checkToken() {
    return async function checkTokenMiddleware(ctx, next) {
        const authHeader = ctx.request.headers.authorization;
        const authHeaderParts = authHeader.split(' ');
        if (authHeaderParts.length === 2) {
            const token = authHeaderParts[1];
            const userId = await authTokenProvider.getUserIdByToken(token);
            if (userId !== null) {
                ctx.userId = userId;
                await next();
            }
        }

        if (ctx.userId === undefined) {
            ctx.throw(401, 'Unauthorized');
        }
    }
}

api
    .use(checkToken())
    .get('/reminders', async (ctx, next) => {
        ctx.body = await reminderProvider.getUserReminders(ctx.userId);
    });

export default api;