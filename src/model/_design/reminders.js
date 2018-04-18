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

const upcomingByUserIdCountMap = function (doc) {
    if (!doc.isCompleted) {
        emit(doc.userId, 1);
    }
}
const completedByUserIdCountMap = function (doc) {
    if (doc.isCompleted) {
        emit(doc.userId, 1);
    }
}

const reduce = function (keys, values, rereduce) {
    if (rereduce) {
        return sum(values);
    }else{
        return values.length;
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
        },
        "upcoming-by-user-id-count": {
            map: upcomingByUserIdCountMap.toString(),
            reduce: reduce.toString()
        },
        "completed-by-user-id-count": {
            map: completedByUserIdCountMap.toString(),
            reduce: reduce.toString()
        },
    }
 };