import Koa from 'koa';
import Router from 'koa-router';
import send from 'koa-send';
import bodyParser from 'koa-bodyparser';

import api from './api';
import auth from './auth';

import config from '../shared/config';
import webpack from 'webpack';
import webpackConfig from '../../webpack.development';
import koaWebpackDevMiddleware from 'koa-webpack-dev-middleware';
import koaWebpackHotMiddleware from 'koa-webpack-hot-middleware';

import bot from '../bot/index.js';

async function initKoaApp() {
    const app = new Koa();
    const router = new Router();

    app.use(bodyParser());

    router
        .use('/api', api.routes(), api.allowedMethods())
        .use('/auth', auth.routes(), auth.allowedMethods());

    if (config.webhookUrl) {
        await bot.start();
        router.post('/telegram/:token', async (ctx) => {                
            try {
                await bot.receiveUpdates([ctx.request.body]);
                ctx.body = '';
                ctx.status = 200;   
            }catch (e) {
                ctx.status = 500;
                ctx.body = JSON.stringify(e);
            }
        });
    }else{
        bot.start();
    }

    if (!config.debug) {
        router
            .get('/assets/*', async (ctx) => {
                await send(ctx, ctx.path, { root: __dirname + '/public' });
            })
            .get('/*', async (ctx) => {
                await send(ctx, 'public/index.html', { root: __dirname });
            });
    } else {
        const compiler = webpack(webpackConfig);
        const koaWebpackDevMiddlewareInstance = koaWebpackDevMiddleware(compiler, { publicPath: '/' });
        router
            .get('/*', (ctx, next) => {
                if (['/reminders', '/settings'].indexOf(ctx.request.path) !== -1) {
                    ctx.request.path = '/';
                }
                return koaWebpackDevMiddlewareInstance(ctx, next);
            });
        app
            .use(koaWebpackHotMiddleware(compiler, { path: '/__webpack_hmr' }));
    }

    app
    .use(router.routes())
    .use(router.allowedMethods());

    app.listen(process.env.PORT || 3200);

}

initKoaApp();