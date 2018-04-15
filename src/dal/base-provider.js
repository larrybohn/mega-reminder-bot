import Nano from 'nano';
import bluebird from 'bluebird';

export default class BaseProvider {
    constructor(connectionString = 'http://localhost:5984', dbName) {
        const nano = Nano(connectionString);
        this._database = nano.db.use(dbName);
        bluebird.promisifyAll(this._database);
    }
}