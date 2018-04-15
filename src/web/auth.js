import Router from 'koa-router';
import Reminder from '../model/reminder';
import AuthTokenProvider from '../dal/auth-token-provider';
import checkToken from './middleware/check-token';

const auth = new Router();
const authTokenProvider = new AuthTokenProvider(process.env.COUCH_DB_CONNECTION_STRING);

auth
    .use(['/username', '/logout'], checkToken())
    .get('/token', async (ctx) => {
        ctx.body = await authTokenProvider.createToken();
    })
    .get('/username', async (ctx, next) => {
        ctx.body = ctx.username;
    })
    .post('/logout', async (ctx, next) => {
        await authTokenProvider.invalidateToken(ctx.authToken);
        ctx.body = '';
    });

export default auth;