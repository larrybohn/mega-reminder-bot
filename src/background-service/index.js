import TeleBot from 'telebot';
import { PollingIntervalMilliseconds } from './constants';
import Nano from 'nano';
import UserKeyboardSettings from '../model/user-keyboard-settings';
import KeyboardHelper from '../shared/keyboard-helper';
import ReminderProvider from '../dal/reminder-provider';
import Reminder from '../model/reminder';

const token = process.env.BOT_TOKEN;
const bot = new TeleBot({
    token
});
const keyboardHelper = new KeyboardHelper(bot);
const reminderProvider = new ReminderProvider();

function getKeyboard(userId, messageId) {
    const userKeyboardSettings = UserKeyboardSettings.GetDefault(); //todo: get from database
    return keyboardHelper.BuildReminderKeyboard(userKeyboardSettings.buttons, messageId);
}

function pollReminders() {
    return reminderProvider.getPendingReminders(Date.now()).then(reminders => Promise.all(
        reminders.map(async reminder => {
            const keyboard = getKeyboard(reminder.userId, reminder.messageId);

            try {
                await bot.sendMessage(reminder.chatId, 'Mark as completed ✓ or Snooze ⏰', {
                    replyToMessage: reminder.messageId,
                    replyMarkup: keyboard
                });
                return reminderProvider.markReminded(reminder._id);
            }catch(e) {
                console.log(e);
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
        setTimeout(startPolling, PollingIntervalMilliseconds);
    }
}

startPolling();