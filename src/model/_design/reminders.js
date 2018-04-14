const byReminderTime = function (doc) {
    if (doc.timeIntervalSeconds && !doc.isCompleted) {
        const baseDate = doc.lastSnoozeDate || doc.createdDate;
        emit(baseDate + 1000*doc.timeIntervalSeconds, null);
    }
};

const byUserId = function (doc) {
    emit(doc.userId, null);
}

module.exports = {
    _id: "_design/reminders",
    views: {
        "by-reminder-time": {
            map: byReminderTime.toString()
        },
        "by-user-id": {
            map: byUserId.toString()
        }
    }
 };