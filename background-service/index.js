const TeleBot = require('telebot');

const token = process.env.BOT_TOKEN;
const bot = new TeleBot({
    token
});

setInterval(() => {
    bot.sendMessage(97296341, (new Date()));
}, 15*1000);
