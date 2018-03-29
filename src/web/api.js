import Router from 'koa-router';
import Reminder from '../model/Reminder';

const api = new Router();

api
    .get('/reminders', async (ctx, next) => {
        ctx.body = [new Reminder()]
    });

export default api;