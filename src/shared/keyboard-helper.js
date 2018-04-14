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
        return formatTimeInterval(timeInterval);
    }
}

function buildTimeIntervalButtons(bot, buttons, reminderId) {
    return buttons.map(row => row.map(timeInterval =>
        //todo: remove messageId?
        bot.inlineButton(formatTimeInterval(timeInterval), { callback: `${timeInterval}|${reminderId}`})));    
}

function formatTimeInterval(timeInterval) {
    const days = Math.floor(timeInterval / 24 / 3600);
    const hours = Math.floor(timeInterval % (24*3600) / 3600);
    const minutes = Math.floor(timeInterval % 3600 / 60);
    const seconds = Math.floor(timeInterval % 60);
    
    return [formatTimeUnit(days, 'day'),
    formatTimeUnit(hours, 'hour'),
    formatTimeUnit(minutes, 'minute'),
    formatTimeUnit(seconds, 'second')].join(' ').trim();
}

function formatTimeUnit(value, unit) {
    if (value === 0) {
        return ''
    }else if (value === 1) {
        return `${value} ${unit}`
    }else{
        return `${value} ${unit}s`
    }
}