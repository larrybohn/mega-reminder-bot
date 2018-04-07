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
    .get('/assets/*', async (ctx) => {
        await send(ctx, ctx.path, { root: __dirname + '/public'});
    })
    .use('/api', api.routes(), api.allowedMethods())
    .use('/auth', auth.routes(), auth.allowedMethods())
    .get('/', async (ctx) => {
        await send(ctx, 'public/index.html', {root: __dirname });
    });    

if (config.debug === true) {
    const compiler = webpack(webpackConfig);
    app
        .use(koaWebpackDevMiddleware(compiler, {publicPath: '/'}))
        .use(koaWebpackHotMiddleware(compiler, {path: '/__webpack_hmr'}));
}


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3200);