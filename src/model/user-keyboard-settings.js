export default class UserKeyboardSettings {
    constructor(userId, buttons) { //todo: snooze capabilities, mark as completed etc.
        this.userId = userId;
        this.buttons = buttons;
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
        return new UserKeyboardSettings(userId, keyboardItems);
    }
}