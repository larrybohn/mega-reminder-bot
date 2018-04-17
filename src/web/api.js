import Router from 'koa-router';
import Reminder from '../model/reminder';
import ReminderProvider from '../dal/reminder-provider';
import checkToken from './middleware/check-token';
import UserSettingsProvider from '../dal/user-settings-provider';
import UserSettings from '../model/user-settings';
import config from '../shared/config';

const reminderProvider = new ReminderProvider(process.env.COUCH_DB_CONNECTION_STRING);
const userSettingsProvider = new UserSettingsProvider(process.env.COUCH_DB_CONNECTION_STRING);

const api = new Router();

api
    .get('/definitions', async (ctx) => {
        ctx.body = {
            telegramBotId: config.telegramBotId
        };
    })
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
    })
    .get('/user-settings', async (ctx, next) => {
        let userSettings = await userSettingsProvider.getUserSettings(ctx.userId);
        if (!userSettings) {
            userSettings = UserSettings.GetDefault(ctx.userId, config.debug);
            await userSettingsProvider.setUserSettings(userSettings);
        }
        ctx.body = userSettings;
    })
    .post('/user-settings', async (ctx, next) => {
        const userSettings = new UserSettings(ctx.userId, ctx.request.body.buttons, ctx.request.body.timezone);
        await userSettingsProvider.setUserSettings(userSettings);
        ctx.status = 200;
        ctx.body = '';
    })

export default api;