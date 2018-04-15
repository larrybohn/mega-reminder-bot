import { combineReducers } from 'redux';
import auth from './auth';
import reminders from './reminders';
import settings from './settings';

export default combineReducers({
    auth,
    reminders,
    settings
});