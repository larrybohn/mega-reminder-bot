import TeleBot from 'telebot';
import {PollingIntervalMilliseconds} from './constants';
import Nano from 'nano';

const token = process.env.BOT_TOKEN;
const bot = new TeleBot({
    token
});
const nano = Nano('http://localhost:5984');
const database = nano.db.use('reminders');

setInterval(() => {

    database.view('reminders', 'by-reminder-time', { include_docs: true, endkey: Date.now() }, function(err, body) {
        if (!err) {
          body.rows.forEach(doc => {
           // bot.forwardMessage(doc.doc.chatId, doc.doc.chatId, doc.doc.messageId).then(function(data) {
              bot.sendMessage(doc.doc.chatId, '------------', {
                replyToMessage: doc.doc.messageId,
                replyMarkup: bot.inlineKeyboard([[
                  bot.inlineButton('Mark Completed', {callback:'completed'}),
                  bot.inlineButton('Snooze', {callback: 'snooze'})
                ]])                
              });
              database.destroy(doc.doc._id, doc.doc._rev);
            });
          //});
        }
      });

    
}, PollingIntervalMilliseconds/3);
