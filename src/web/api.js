import Router from 'koa-router';
import Reminder from '../model/Reminder';
import ReminderProvider from '../dal/reminder-provider';
import checkToken from './middleware/check-token';

const reminderProvider = new ReminderProvider();

const api = new Router();

api
    .use(checkToken())
    .get('/reminders', async (ctx, next) => {
        ctx.body = await reminderProvider.getUserReminders(ctx.userId);
    });

export default api;