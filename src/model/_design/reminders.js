const byReminderTime = function (doc) {
    if (doc.timeIntervalSeconds && !doc.isCompleted) {
        const baseDate = doc.lastSnoozeDate || doc.createdDate;
        emit(baseDate + 1000*doc.timeIntervalSeconds, null);
    }
};

const upcomingByUserId = function (doc) {
    if (!doc.isCompleted) {
        emit([doc.userId, (doc.lastSnoozeDate || doc.createdDate)+1000*doc.timeIntervalSeconds], null);
    }
}

const completedByUserId = function (doc) {
    if (doc.isCompleted) {
        emit([doc.userId, (doc.lastSnoozeDate || doc.createdDate)+1000*doc.timeIntervalSeconds], null);
    }
}

module.exports = {
    _id: "_design/reminders",
    views: {
        "by-reminder-time": {
            map: byReminderTime.toString()
        },
        "upcoming-by-user-id": {
            map: upcomingByUserId.toString()
        },
        "completed-by-user-id": {
            map: completedByUserId.toString()
        }
    }
 };