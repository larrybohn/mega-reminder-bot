export default class Reminder {
    constructor(chatId, userId, messageId, timeInterval, summary) { //todo: snooze capabilities, mark as completed etc.
        this.type = "reminder";
        this.userId = userId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.timeIntervalSeconds = timeInterval;        
        this.createdDate = Date.now();
        this.lastSnoozeDate = null;
        this.isCompleted = false;
        this.summary = summary;
        this.snoozeCount = 0;
    }
}
