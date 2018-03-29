import Nano from 'nano';
import bluebird from 'bluebird';
import Reminder from '../model/reminder';

export default class ReminderProvider {
    constructor(connectionString = 'http://localhost:5984') {
        const nano = Nano(connectionString);
        this._database = nano.db.use('reminders');
        bluebird.promisifyAll(this._database);
    }    

    addReminder(reminder) {
        //let {userId, messageId, ...dbReminder} = reminder;
        //dbReminder._id = [userId, messageId];
        return this._database.insertAsync(reminder);
    }

    async markReminded(_id) {
        const dbReminder = await this._database.getAsync(_id);
        dbReminder.isCompleted = true;
        return this._database.insertAsync(dbReminder);
    }

    async getPendingReminders(date) {
        const body = await this._database.viewAsync('reminders', 'by-reminder-time',  { include_docs: true, endkey: date });
        return body.rows.map(dbReminder => Object.assign(new Reminder, dbReminder.doc));
    }

    async getUserReminders(userId) {
        const body = await this._database.viewAsync('reminders', 'by-user-id',  { include_docs: true, startkey: userId, endkey: userId });
        return body.rows.map(dbReminder => Object.assign(new Reminder, dbReminder.doc));
    }

    /*completeReminder() {
        return this._database
    }*/
}