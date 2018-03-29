const map = function (doc) {
    if (!doc.isCompleted) {
        emit(doc.createdDate + 1000*doc.timeIntervalSeconds, null);
    }
};

module.exports = {
    _id: "_design/reminders",
    views: {
        "by-reminder-time": {
            map: map.toString()
        }
    }
 };