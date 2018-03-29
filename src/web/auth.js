import Router from 'koa-router';
import Reminder from '../model/Reminder';
import AuthTokenProvider from '../dal/auth-token-provider';

const auth = new Router();
const authTokenProvider = new AuthTokenProvider(); //todo: connection string from config

auth
    .get('/token', async (ctx, next) => {
        ctx.body = await authTokenProvider.createToken();
    });

export default auth;