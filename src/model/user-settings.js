export default class UserSettings {
    constructor(userId, buttons, timezone) { //todo: snooze capabilities, mark as completed etc.
        this._id = userId.toString();
        this.buttons = buttons;
        this.timezone = timezone;
    }

    static GetDefault(userId, includeDebugButtons) {
        let keyboardItems = [            
            [1*60, 5*60, 15*60, 30*60],
            [1*3600, 2*3600, 4*3600, 8*3600],
            [1*24*3600, 2*24*3600, 7*24*3600]            
        ];
        if (includeDebugButtons) {
            keyboardItems.unshift([1, 2, 5, 10]);
        }
        return new UserSettings(userId, keyboardItems);
    }
}