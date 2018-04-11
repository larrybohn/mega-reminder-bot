import Koa from 'koa';
import Router from 'koa-router';
import send from 'koa-send';

import api from './api';
import auth from './auth';

import config from '../shared/config';
import webpack from 'webpack';
import webpackConfig from '../../webpack.development';
import koaWebpackDevMiddleware from 'koa-webpack-dev-middleware';
import koaWebpackHotMiddleware from 'koa-webpack-hot-middleware';

const app = new Koa();
const router = new Router();

router
    .use('/api', api.routes(), api.allowedMethods())
    .use('/auth', auth.routes(), auth.allowedMethods());

if (!config.debug) {
    router
        .get('/assets/*', async (ctx) => {
            await send(ctx, ctx.path, { root: __dirname + '/public'});
        })
        .get('/*', async (ctx) => {
            await send(ctx, 'public/index.html', {root: __dirname });
        });
}else{
    const compiler = webpack(webpackConfig);
    const koaWebpackDevMiddlewareInstance = koaWebpackDevMiddleware(compiler, {publicPath: '/'});
    router
        .get('/*', (ctx, next) => {
            if (['/dashboard'].indexOf(ctx.request.path) !== -1) {
                ctx.request.path = '/';
            }
            return koaWebpackDevMiddlewareInstance(ctx, next);
        });
    app
        .use(koaWebpackHotMiddleware(compiler, {path: '/__webpack_hmr'}));
}


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3200);