import {formatTimeInterval} from './format-time';

export default class KeyboardHelper {
    constructor (telebot) {
        this.bot = telebot;
    }

    BuildSetNotificationKeyboard(buttons, reminderId) {
        let keyboard = buildTimeIntervalButtons(this.bot, buttons, reminderId);
        keyboard.push([this.bot.inlineButton('Cancel', {callback:`cancel|${reminderId}`})]);
        return this.bot.inlineKeyboard(keyboard);
    }

    BuildReminderKeyboard(buttons, reminderId) {
        let keyboard = buildTimeIntervalButtons(this.bot, buttons, reminderId);
        keyboard.push([
            this.bot.inlineButton('Completed ✓', {callback:`completed|${reminderId}`}),
        ]);
        return this.bot.inlineKeyboard(keyboard);
    }

    GetEmptyKeyboard() {
        this.bot.inlineKeyboard([[]]);
    }

    static FormatTimeInterval(timeInterval) {
        return formatTimeInterval(timeInterval, true);
    }
}

function buildTimeIntervalButtons(bot, buttons, reminderId) {
    return buttons.map(row => row.map(timeInterval =>
        bot.inlineButton(formatTimeInterval(timeInterval, true), { callback: `${timeInterval}|${reminderId}`})));    
}