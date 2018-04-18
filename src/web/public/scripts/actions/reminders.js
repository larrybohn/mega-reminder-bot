import axios from 'axios';

export const REMINDERS_LOADED = 'REMINDERS_LOADED';
export const REMINDERS_LOADING_ERROR = 'REMINDERS_LOADING_ERROR';
export const REMINDERS_LOADING = 'REMINDERS_LOADING';
export const REMINDER_DELETING = 'REMINDER_DELETING';
export const REMINDER_DELETED = 'REMINDER_DELETED';
export const REMINDER_DELETING_ERROR = 'REMINDER_DELETING_ERROR';

export const loadReminders = (type, page=1) => dispatch => {
    dispatch({
        type: REMINDERS_LOADING,
        payload: {type}
    });
    axios.get(`/api/reminders/${type}`, {params: { page }})
        .then(body => {
            dispatch({
                type: REMINDERS_LOADED,
                payload: {
                    type,
                    ...body.data,
                    currentPage: page
                }
            });
        })
        .catch(error => {
            dispatch({
                type: REMINDERS_LOADING_ERROR,
                payload: {
                    type,
                    error
                }
            });
        });        
};

export const loadAllReminders= () => dispatch => {
    loadReminders('completed')(dispatch);
    loadReminders('upcoming')(dispatch);
};

export const deleteReminder = (reminderId, type) => dispatch => {
    dispatch({
        type: REMINDER_DELETING,
        payload: {
            reminderId
        }
    });
    axios.delete(`/api/reminders/${reminderId}`)
        .then(body => {
            loadReminders(type)(dispatch);
        })
        .catch(error => {
            dispatch({
                type: REMINDER_DELETING_ERROR,
                payload: {
                    error
                }
            });
        });
};