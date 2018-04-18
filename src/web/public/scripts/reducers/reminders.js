import * as reminderActions from '../actions/reminders';

const initialState = {
    completed: null,
    upcoming: null
};

export default function remindersState(state = initialState, action) {
    switch (action.type) {
        case reminderActions.REMINDERS_LOADING: {
            let nextReminders = {...state[action.payload.type]};
            return {
                ...state,
                [action.payload.type]: {...nextReminders, isLoading: true}
            };
        }
        case reminderActions.REMINDERS_LOADED:
            return { ...state,
                isLoading: false,
                [action.payload.type]: {
                    ...action.payload,
                    isLoading: false
                }
            };
        case reminderActions.REMINDERS_LOADING_ERROR: {
            let nextReminders = {...state[action.payload.type]};
            return {
                ...state,
                [action.payload.type]: {...nextReminders, isLoading: false}
            };
        }
        case reminderActions.REMINDER_DELETING: {
            const nextState = { ...state };
            const mapReminders = (type) => nextState[type] = {...state[type], reminders: state[type].reminders.map(reminder =>
                reminder._id === action.payload.reminderId ? { ...reminder, isBusy: true } : reminder)};
            mapReminders('upcoming');
            mapReminders('completed');
            return nextState;
        }
        case reminderActions.REMINDER_DELETING_ERROR: {
            const nextState = { ...state };
            nextState.reminders = state.reminders.map(reminder =>
                reminder._id === action.payload.reminderId ? { ...reminder, isBusy: false } : reminder);
            return nextState;
        }
        case reminderActions.REMINDER_DELETED: {
            
        }
        default:
            return state;
    }
}