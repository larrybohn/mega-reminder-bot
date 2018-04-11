const map = function (doc) {
    if (doc.userId != null) {
        emit(doc.token, null);
    }
};

module.exports = {
    _id: "_design/auth-tokens",
    views: {
        "by-token": {
            map: map.toString()
        }
    }
 };