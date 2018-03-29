import Nano from 'nano';
import bluebird from 'bluebird';
import AuthToken from '../model/auth-token';

export default class AuthTokenProvider {
    constructor(connectionString = 'http://localhost:5984') {
        const nano = Nano(connectionString);
        this._database = nano.db.use('auth-tokens');
        bluebird.promisifyAll(this._database);
    }

    async createToken() {
        let token = new AuthToken();
        const dbToken = await this._database.insertAsync(token);
        return token.token;
    }

    async getUserIdByToken(token) {
        const body = await this._database.viewAsync('auth-tokens', 'by-token', { include_docs: true, startkey: token, endkey: token });
        if (body.rows.length === 1) {
            return body.rows[0].doc.userId;
        }else{
            return null;
        }
    }

    async authenticateToken(token, userId) {
        const body = await this._database.viewAsync('auth-tokens', 'by-token', { include_docs: false, startkey: token, endkey: token });
        if (body.rows.length === 1) {
            const authTokenId = body.rows[0].id;
            const dbAuthToken = await this._database.getAsync(authTokenId);
            dbAuthToken.userId = userId;
            await this._database.insertAsync(dbAuthToken);
            return true;
        }else{
            return false;
        }
    }
}