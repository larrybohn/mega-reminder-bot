import config from '../shared/config';
import TeleBot from 'telebot';
import Reminder from '../model/reminder';
import UserKeyboardSettings from '../model/user-keyboard-settings';
import KeyboardHelper from '../shared/keyboard-helper';
import ReminderProvider from '../dal/reminder-provider';

const token = process.env.BOT_TOKEN;
let telebotOptions = { token };
if (config.webhookUrl) {
    telebotOptions = { 
        webhook: {
            url: config.webhookUrl,
            port: process.env.PORT
        },
        ...telebotOptions
    }
}
const bot = new TeleBot(telebotOptions);
const keyboardHelper = new KeyboardHelper(bot);
const emptyKeyboard = keyboardHelper.GetEmptyKeyboard();
const reminderProvider = new ReminderProvider(process.env.COUCH_DB_CONNECTION_STRING);

//Conversation start
bot.on('/start', (msg) => {
    msg.reply.text('Welcome to ReminderBot. Drop me a message, picture or file to get reminder.');
});

bot.on('/auth', (msg) => {
    console.log(msg);
    //todo: issue POST request to web-ui/authenticate
});

//Reminder is sent
bot.on('*', (msg, self) => {
    if (self.type !== 'command') {
        const userKeyboardSettings = UserKeyboardSettings.GetDefault(msg.from.id, config.debug); //todo: get from database
        const keyboard = keyboardHelper.BuildSetNotificationKeyboard(userKeyboardSettings.buttons, msg.message_id);
        return bot.sendMessage(
            msg.chat.id,
            'When do you want to get a reminder?',
            {replyMarkup: keyboard}
        );
    }
});

//Inline button is pressed
bot.on('callbackQuery', async msg => {
    // User message alert
    let [command, notificationMessageId] = msg.data.split('|');

    try {
        if (command === 'cancel') { //todo: move command codes to constants
            await cancelReminder(msg);
        }else if (command === 'completed') {
            await completeReminder(msg);
        }else if (!isNaN(command)) {
            const timeInterval = Number(command);
            await setReminder(msg, notificationMessageId, timeInterval);
        }
    }catch(e) {
        console.log(e);
    }

});

function cancelReminder(msg) {
    bot.answerCallbackQuery(msg.id);
    return bot.editMessageText({
        chatId: msg.message.chat.id,
        messageId: msg.message.message_id
    }, 'Reminder cancelled', {replyMarkup: emptyKeyboard});
}

async function completeReminder(msg) {
    await bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
    return bot.answerCallbackQuery(msg.id, {text: 'Done!'});
}

async function setReminder(msg, notificationMessageId, timeInterval) {
    const formattedTimeInterval = KeyboardHelper.FormatTimeInterval(timeInterval);
    const reminder = new Reminder(msg.message.chat.id, msg.from.id, notificationMessageId, timeInterval);
    try {
        bot.answerCallbackQuery(msg.id);
        await reminderProvider.addReminder(reminder)
        bot.editMessageText({
                chatId: msg.message.chat.id,
                messageId: msg.message.message_id
            }, `You will be notified in ${formattedTimeInterval}`, {replyMarkup: emptyKeyboard});
    }catch(e) {
        bot.sendMessage(msg.message.chat.id, 'Something went wrong, please try again later');
        throw e;
    }
}

bot.start();