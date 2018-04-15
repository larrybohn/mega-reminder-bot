import AuthTokenProvider from '../../dal/auth-token-provider';
const authTokenProvider = new AuthTokenProvider(process.env.COUCH_DB_CONNECTION_STRING);

export default function checkToken() {
    return async function checkTokenMiddleware(ctx, next) {
        const authHeader = ctx.request.headers.authorization;
        if (authHeader) {
            const authHeaderParts = authHeader.split(' ');
            if (authHeaderParts.length === 2) {
                const token = authHeaderParts[1];
                const user = await authTokenProvider.getUserByToken(token);
                if (user !== null) {
                    ctx.userId = user.userId;
                    ctx.username = user.username;
                    ctx.authToken = token;
                    await next();
                }
            }
        }

        if (ctx.userId === undefined) {
            ctx.throw(401, 'Unauthorized');
        }
    }
}