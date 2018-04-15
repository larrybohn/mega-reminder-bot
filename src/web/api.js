import Router from 'koa-router';
import Reminder from '../model/reminder';
import ReminderProvider from '../dal/reminder-provider';
import checkToken from './middleware/check-token';

const reminderProvider = new ReminderProvider();

const api = new Router();

api
    .use(checkToken())
    .get('/reminders', async (ctx, next) => {
        const reminders = await reminderProvider.getUserReminders(ctx.userId);
        const sortedReminders = reminders.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return Number(a.isCompleted) - Number(b.isCompleted);
            }else{
                const aDate = (a.lastSnoozeDate || a.createdDate) + 1000*a.timeIntervalSeconds;
                const bDate = (b.lastSnoozeDate || b.createdDate) + 1000*b.timeIntervalSeconds;
                if (a.isCompleted) {
                    return bDate - aDate;
                }else{
                    return aDate - bDate;
                }
            }
        });
        ctx.body = sortedReminders;
    })
    .delete('/reminders/:reminderId', async (ctx, next) => {
        await reminderProvider.deleteReminder(ctx.params.reminderId);
        ctx.status = 200;
        ctx.body = '';
    });

export default api;