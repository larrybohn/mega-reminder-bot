import { combineReducers } from 'redux';
import auth from './auth';
import reminders from './reminders';

export default combineReducers({
    auth,
    reminders
});