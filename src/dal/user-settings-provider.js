import BaseProvider from './base-provider';
import UserSettings from '../model/user-settings';

export default class UserSettingsProvider extends BaseProvider {
    constructor(connectionString) {
        super(connectionString, 'user-settings');
    }

    async getUserSettings(userId) {
        try {
            return await this._database.getAsync(userId);
        }catch (e){
            return null;
        }
    }

    async setUserSettings(userSettings) {
        let dbUserSettings = await this._database.getAsync(userSettings._id).catch(() => null);
        dbUserSettings = {...dbUserSettings, ...userSettings};
        return this._database.insertAsync(dbUserSettings);
    }
}