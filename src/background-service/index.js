import config from '../shared/config';
import TeleBot from '../telebot/lib/telebot';
import UserSettings from '../model/user-settings';
import KeyboardHelper from '../shared/keyboard-helper';
import ReminderProvider from '../dal/reminder-provider';
import UserSettingsProvider from '../dal/user-settings-provider';
import Reminder from '../model/reminder';

const token = process.env.BOT_TOKEN;
const bot = new TeleBot({
    token
});
const keyboardHelper = new KeyboardHelper(bot);
const reminderProvider = new ReminderProvider(process.env.COUCH_DB_CONNECTION_STRING);
const userSettingsProvider = new UserSettingsProvider(process.env.COUCH_DB_CONNECTION_STRING);

async function getKeyboard(userId, reminderId) {
    let userSettings = await userSettingsProvider.getUserSettings(userId);
    if (!userSettings) {
        userSettings = UserSettings.GetDefault(userId, config.debug);
    }
    return keyboardHelper.BuildReminderKeyboard(userSettings.buttons, reminderId);
}

function pollReminders() {
    return reminderProvider.getPendingReminders(Date.now()).then(reminders => Promise.all(
        reminders.map(async reminder => {
            const keyboard = await getKeyboard(reminder.userId, reminder._id);

            try {
                await bot.sendMessage(reminder.chatId, 'Mark as completed ✓ or Snooze ⏰', {
                    replyToMessage: reminder.messageId,
                    replyMarkup: keyboard
                });
                return reminderProvider.markReminded(reminder._id);
            }catch(e) {
                if (e.error_code === 403) { //user has stopped and blocked bot
                    reminderProvider.markReminded(reminder._id);
                }else{
                    console.log(e);
                }
            }
        })
    ));
}

async function startPolling() {
    try {
        await pollReminders();
    } catch (e) {
        console.log(e);
    } finally {
        setTimeout(startPolling, 1000*config.backgroundServicePollingIntervalSeconds);
    }
}

startPolling();