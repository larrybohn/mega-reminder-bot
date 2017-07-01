const TeleBot = require('telebot');

const token = process.env.BOT_TOKEN;
const bot = new TeleBot({
    token,
    webhook: {
        url: 'https://megareminderbot.herokuapp.com', //todo: move to config
        port: process.env.PORT || 8443
    }
});

bot.on('/start', (msg) => {
    msg.reply.text('Welcome to ReminderBot. Drop me a message, picture or file to get reminder.');
});

const TIME_INTERVAL = { //todo: this should be completely customizible by user
    sec5: {
        label: '5 seconds',
        value: 5
    },
    sec30: {
        label: '30 seconds',
        value: 30
    },
    min1: {
        label: '1 minute',
        value: 60
    },
    min5: {
        label: '5 minutes',
        value: 5*60,
    },
    min15: {
        label: '15 minutes',
        value: 15*60
    },
    min30: {
        label: '30 minutes',
        value: 30*60
    },
    hr1: {
        label: '1 hour',
        value: 3600
    },
    hr2: {
        label: '2 hours',
        value: 2*3600
    },
    hr4: {
        label: '4 hours',
        value: 4*3600
    },
    hr8: {
        label: '8 hours',
        value: 8*3600
    },
    d1: {
        label: '1 day',
        value: 24*3600
    },
    d2: {
        label: '2 days',
        value: 2*24*3600
    },
    w1: {
        label: '1 week',
        value: 7*24*3600
    }
};

const timeIntervalInlineButton = function (timeInterval, messageId) {
    return bot.inlineButton(timeInterval.label, { callback: timeInterval.value+'|'+messageId });
};

const timeIntervalKeyboard = function (messageId) {
    return bot.inlineKeyboard([
        [
            TIME_INTERVAL.sec5,
            TIME_INTERVAL.sec30,
            TIME_INTERVAL.min1,
            TIME_INTERVAL.min5,
            TIME_INTERVAL.min15,
            TIME_INTERVAL.min30
        ].map((t) => timeIntervalInlineButton(t,messageId)),
        [
            TIME_INTERVAL.hr1,
            TIME_INTERVAL.hr2,
            TIME_INTERVAL.hr4,
            TIME_INTERVAL.hr8
        ].map((t) => timeIntervalInlineButton(t,messageId)),
        [
            TIME_INTERVAL.d1,
            TIME_INTERVAL.d2,
            TIME_INTERVAL.w1
        ].map((t) => timeIntervalInlineButton(t,messageId))
    ]);
}
const emptyKeyboard = bot.inlineKeyboard([[]]);

bot.on('*', (msg, self) => {
    if (self.type !== 'command') {
        return bot.sendMessage(msg.from.id, 'When do you want to get a reminder?', {replyMarkup: timeIntervalKeyboard(msg.message_id)});
    }
});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    bot.answerCallbackQuery(msg.id);
    let [timeIntervalSeconds, notificationMessageId] = msg.data.split('|');
    let timeIntervalObject;
    for (let t in TIME_INTERVAL) {
        if (TIME_INTERVAL[t].value == timeIntervalSeconds) {
            timeIntervalObject = TIME_INTERVAL[t];
            break;
        }
    }
    bot.editMessageText({chatId: msg.from.id, messageId: msg.message.message_id} ,`You will be notified in ${timeIntervalObject.label}`, {replyMarkup: emptyKeyboard});

    setTimeout(function() {
        bot.forwardMessage(msg.from.id, msg.from.id, notificationMessageId)
    }, timeIntervalSeconds*1000); //todo: implement snooze / dismiss functionality
});

bot.start();