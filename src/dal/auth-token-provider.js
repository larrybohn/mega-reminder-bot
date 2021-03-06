import BaseProvider from './base-provider';
import AuthToken from '../model/auth-token';

export default class AuthTokenProvider extends BaseProvider {
    constructor(connectionString) {
        super(connectionString, 'auth-tokens');
    }

    async createToken() {
        let token = new AuthToken();
        const dbToken = await this._database.insertAsync(token);
        return token.token;
    }

    async invalidateToken(token) {
        const body = await this._database.viewAsync('auth-tokens', 'by-token', { include_docs: true, startkey: token, endkey: token });
        if (body.rows.length === 1) {
            await this._database.destroyAsync(body.rows[0].id, body.rows[0].doc._rev);
        }
    }

    async getUserByToken(token) {
        const body = await this._database.viewAsync('auth-tokens', 'by-token', { include_docs: true, startkey: token, endkey: token });
        if (body.rows.length === 1 && body.rows[0].doc.userId) {
            return {
                userId: body.rows[0].doc.userId,
                username: body.rows[0].doc.username
            }
        }else{
            return null;
        }
    }

    async authenticateToken(token, userId, username) {
        const body = await this._database.viewAsync('auth-tokens', 'by-token', { include_docs: false, startkey: token, endkey: token });
        if (body.rows.length === 1) {
            const authTokenId = body.rows[0].id;
            const dbAuthToken = await this._database.getAsync(authTokenId);
            dbAuthToken.userId = userId;
            dbAuthToken.username = username;
            await this._database.insertAsync(dbAuthToken);
            return true;
        }else{
            return false;
        }
    }
}