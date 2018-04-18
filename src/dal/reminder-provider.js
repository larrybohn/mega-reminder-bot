import BaseProvider from './base-provider';
import Reminder from '../model/reminder';

export const PageSize = 5;

export default class ReminderProvider extends BaseProvider {
    constructor(connectionString) {
        super(connectionString, 'reminders');
    } 

    addReminder(reminder) {
        //let {userId, messageId, ...dbReminder} = reminder;
        //dbReminder._id = [userId, messageId];
        return this._database.insertAsync(reminder).then(response => response.id);
    }

    async setReminder(_id, timeInterval) {
        const dbReminder = await this._database.getAsync(_id);
        dbReminder.isCompleted = false;
        if (dbReminder.timeIntervalSeconds === null) {
            dbReminder.createdDate = Date.now();
        }else{
            dbReminder.lastSnoozeDate = Date.now();
            ++dbReminder.snoozeCount;
        }
        dbReminder.timeIntervalSeconds = timeInterval;
        
        return this._database.insertAsync(dbReminder);
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

    async getUserReminders(userId, type, page) {
        let params = {
            include_docs: true,
            limit: PageSize,
            skip: (page-1)*PageSize
        };
        params = type==='completed' ?
            {...params, descending: true, startKey: [userId, {}], endkey: [userId]} :
            {...params, startkey: [userId], endkey: [userId, {}]};
        const body = await this._database.viewAsync('reminders', `${type}-by-user-id`, params);
        return {
            reminders: body.rows.map(dbReminder => Object.assign(new Reminder, dbReminder.doc)),
            totalPages: Math.ceil(body.total_rows/PageSize)
        };
    }

    async deleteReminder(reminderId) {
        const body = await this._database.getAsync(reminderId);
        return this._database.destroyAsync(body._id, body._rev);
    }
}