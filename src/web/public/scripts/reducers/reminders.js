import * as reminderActions from '../actions/reminders';

const initialState = {
    reminders: null,
    isLoading: false,
    error: null
};

export default function remindersState(state = initialState, action) {
    switch (action.type) {
        case reminderActions.REMINDERS_LOADING:
            return { ...state, reminders: null, isLoading: true, error: null };
        case reminderActions.REMINDERS_LOADED:
            return { ...state, isLoading: false, reminders: action.payload.reminders };
        case reminderActions.REMINDERS_LOADING_ERROR:
            return { ...state, isLoading: false, error: action.payload.error };
        case reminderActions.REMINDER_DELETING: {
            const nextState = { ...state };
            nextState.reminders = state.reminders.map(reminder =>
                reminder._id === action.payload.reminderId ? { ...reminder, isBusy: true } : reminder);
            return nextState;
        }
        case reminderActions.REMINDER_DELETING_ERROR: {
            const nextState = { ...state };
            nextState.reminders = state.reminders.map(reminder =>
                reminder._id === action.payload.reminderId ? { ...reminder, isBusy: false } : reminder);
            return nextState;
        }
        case reminderActions.REMINDER_DELETED: {
            const nextState = { ...state };
            nextState.reminders = state.reminders.filter(reminder => reminder._id != action.payload.reminderId);
            return nextState;
        }
        default:
            return state;
    }
}