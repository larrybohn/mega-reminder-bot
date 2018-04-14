import axios from 'axios';

export const REMINDERS_LOADED = 'REMINDERS_LOADED';
export const REMINDERS_LOADING_ERROR = 'REMINDERS_LOADING_ERROR';
export const REMINDERS_LOADING = 'REMINDERS_LOADING';
export const REMINDER_DELETING = 'REMINDER_DELETING';

export const loadReminders = () => dispatch => {
    dispatch({
        type: REMINDERS_LOADING
    });
    axios.get('/api/reminders')
        .then(body => {
            dispatch({
                type: REMINDERS_LOADED,
                payload: {
                    reminders: body.data
                }
            });
        })
        .catch(error => {
            dispatch({
                type: REMINDERS_LOADING_ERROR,
                payload: {
                    error
                }
            });
        });        
};

export const deleteReminder = (reminderId) => dispatch => {
    dispatch({
        type: REMINDER_DELETING,
        payload: {
            reminderId
        }
    });
};