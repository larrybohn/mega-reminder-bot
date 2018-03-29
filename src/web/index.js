import Koa from 'koa';
import Router from 'koa-router';
import send from 'koa-send';

import api from './api';
import auth from './auth';

const app = new Koa();
const router = new Router();

router
    //.get('/*', serve(__dirname + '/public', { index: 'index.html' }))
    .use('/api', api.routes(), api.allowedMethods())
    .use('/auth', auth.routes(), auth.allowedMethods())
    .get('/', async (ctx) => {
        await send(ctx, 'public/index.html', {root: __dirname });
    });    


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3200);