import TeleBot from 'telebot';
import Reminder from '../model/reminder';
import UserKeyboardSettings from '../model/user-keyboard-settings';
import KeyboardHelper from '../shared//keyboard-helper';
import Nano from 'nano';
const nano = Nano('http://localhost:5984');
const database = nano.db.use('reminders');

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

//Conversation start
bot.on('/start', (msg) => {
    msg.reply.text('Welcome to ReminderBot. Drop me a message, picture or file to get reminder.');
});

//Reminder is sent
bot.on('*', (msg, self) => {
    if (self.type !== 'command') {
        let userKeyboardSettings = UserKeyboardSettings.GetDefault(); //todo: get from database
        let keyboard = keyboardHelper.BuildReminderKeyboard(userKeyboardSettings.buttons, msg.message_id);
        return bot.sendMessage(
            msg.from.id,
            'When do you want to get a reminder?',
            {replyMarkup: keyboard}
        );
    }
});

//Inline button is pressed
bot.on('callbackQuery', msg => {
    // User message alert
    bot.answerCallbackQuery(msg.id);
    let [command, notificationMessageId] = msg.data.split('|');

    if (command === 'cancel') { //todo: move command codes to constants
        bot.editMessageText({
            chatId: msg.from.id,
            messageId: msg.message.message_id
        }, 'Notification cancelled', {replyMarkup: emptyKeyboard});
    }else if (command === 'completed') {
        //todo
    }else if (!isNaN(command)) {
        const timeInterval = Number(command);
        const formattedTimeInterval = KeyboardHelper.FormatTimeInterval(timeInterval);
        bot.editMessageText({
            chatId: msg.from.id,
            messageId: msg.message.message_id
        }, `You will be notified in ${formattedTimeInterval}`, {replyMarkup: emptyKeyboard});

        const reminder = new Reminder(msg.from.id, notificationMessageId, timeInterval);
        database.insert(reminder, function (err, body) {
            if (err) {
                console.log(err.toString());
            }
        });
    }
});

bot.start();