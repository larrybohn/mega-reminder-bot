import config from '../shared/config';
import TeleBot from '../telebot/lib/telebot';
import Reminder from '../model/reminder';
import UserSettings from '../model/user-settings';
import KeyboardHelper from '../shared/keyboard-helper';
import ReminderProvider from '../dal/reminder-provider';
import AuthTokenProvider from '../dal/auth-token-provider';
import { extractMessageSummary } from './telegram-utils';

const token = process.env.BOT_TOKEN;
let telebotOptions = { token };
if (config.webhookUrl) {
    telebotOptions = {
        ...telebotOptions,
        webhook: {
            url: config.webhookUrl + '/telegram',
            port: process.env.PORT || 3200,
            createServer: false
        }
    }
}
const bot = new TeleBot(telebotOptions);
const keyboardHelper = new KeyboardHelper(bot);
const emptyKeyboard = keyboardHelper.GetEmptyKeyboard();
const reminderProvider = new ReminderProvider(process.env.COUCH_DB_CONNECTION_STRING);
const authTokenProvider = new AuthTokenProvider(process.env.COUCH_DB_CONNECTION_STRING);

//Conversation start or authentication
bot.on('/start', async (msg) => {
    if (msg.text === '/start') {
        msg.reply.text('Welcome to ReminderBot. Drop me a message, picture or file to get reminder.');
    } else {
        const failedMessage = 'Authentication failed. Please try again later.';
        const token = msg.text.split(' ')[1];
        const userId = msg.from.id;
        const username = msg.from.username;
        try {
            const result = await authTokenProvider.authenticateToken(token, userId, username);
            if (result) {
                msg.reply.text('Authentication successful. You can return to the login page now.');
            } else {
                msg.reply.text(failedMessage);
            }
        } catch (e) {
            console.log(e);
            msg.reply.text(failedMessage);
        }
    }
});

//Reminder is sent
bot.on('*', async (msg, self) => {
    if (self.type !== 'command') {
        const userSettings = UserSettings.GetDefault(msg.from.id, config.debug); //todo: get from database

        const messageSummary = extractMessageSummary(msg);
        const reminder = new Reminder(msg.chat.id, msg.from.id, msg.message_id, null, messageSummary);
        const reminderId = await reminderProvider.addReminder(reminder);

        const keyboard = keyboardHelper.BuildSetNotificationKeyboard(userSettings.buttons, reminderId);
        return bot.sendMessage(
            msg.chat.id,
            'When do you want to get a reminder?',
            { replyMarkup: keyboard }
        );
    }
});

//Inline button is pressed
bot.on('callbackQuery', async msg => {
    // User message alert
    let [command, reminderId] = msg.data.split('|');

    try {
        if (command === 'cancel') { //todo: move command codes to constants
            await cancelReminder(msg);
        } else if (command === 'completed') {
            await completeReminder(msg);
        } else if (!isNaN(command)) {
            const timeInterval = Number(command);
            await setReminder(msg, reminderId, timeInterval);
        }
    } catch (e) {
        console.log(e);
    }

});

function cancelReminder(msg) {
    bot.answerCallbackQuery(msg.id);
    return bot.editMessageText({
        chatId: msg.message.chat.id,
        messageId: msg.message.message_id
    }, 'Reminder cancelled', { replyMarkup: emptyKeyboard });
}

async function completeReminder(msg) {
    await bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
    return bot.answerCallbackQuery(msg.id, { text: 'Done!' });
}

async function setReminder(msg, reminderId, timeInterval) {
    const formattedTimeInterval = KeyboardHelper.FormatTimeInterval(timeInterval);
    try {
        bot.answerCallbackQuery(msg.id);
        await reminderProvider.setReminder(reminderId, timeInterval);
        bot.editMessageText({
            chatId: msg.message.chat.id,
            messageId: msg.message.message_id
        }, `You will be notified in ${formattedTimeInterval}`, { replyMarkup: emptyKeyboard });
    } catch (e) {
        bot.sendMessage(msg.message.chat.id, 'Something went wrong, please try again later');
        throw e;
    }
}
bot.logging = true;

if (!config.webhookUrl) {
    bot.start();
}
export default bot;