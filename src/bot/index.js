import TeleBot from 'telebot';
import Reminder from '../model/reminder';
import UserKeyboardSettings from '../model/user-keyboard-settings';
import KeyboardHelper from '../shared/keyboard-helper';
import ReminderProvider from '../dal/reminder-provider';

const token = process.env.BOT_TOKEN;
const bot = new TeleBot({
    token,
    /*webhook: {
        url: 'https://megareminderbot.herokuapp.com', //todo: move to config
        port: process.env.PORT || 8443
    }*/
});
const keyboardHelper = new KeyboardHelper(bot);
const emptyKeyboard = keyboardHelper.GetEmptyKeyboard();
const reminderProvider = new ReminderProvider(process.env.COUCH_DB_CONNECTION_STRING);

//Conversation start
bot.on('/start', (msg) => {
    msg.reply.text('Welcome to ReminderBot. Drop me a message, picture or file to get reminder.');
});

//Reminder is sent
bot.on('*', (msg, self) => {
    if (self.type !== 'command') {
        const userKeyboardSettings = UserKeyboardSettings.GetDefault(); //todo: get from database
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
    bot.answerCallbackQuery(msg.id);
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

async function cancelReminder(msg) {
    return await bot.editMessageText({
        chatId: msg.message.chat.id,
        messageId: msg.message.message_id
    }, 'Reminder cancelled', {replyMarkup: emptyKeyboard});
}

async function completeReminder(msg) {
    // await bot.editMessageText({
    //     chatId: msg.chat.id,
    //     messageId: msg.message.message_id
    // }, `Amazing job!`, {replyMarkup: emptyKeyboard});
    await bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
}

async function setReminder(msg, notificationMessageId, timeInterval) {
    const formattedTimeInterval = KeyboardHelper.FormatTimeInterval(timeInterval);
    const reminder = new Reminder(msg.message.chat.id, msg.from.id, notificationMessageId, timeInterval);
    try {
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