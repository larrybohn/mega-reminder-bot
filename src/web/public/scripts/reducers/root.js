import { combineReducers } from 'redux';
import auth from './auth';
import reminders from './reminders';
import settings from './settings';
import definitions from './definitions';

export default combineReducers({
    auth,
    reminders,
    settings,
    definitions
});