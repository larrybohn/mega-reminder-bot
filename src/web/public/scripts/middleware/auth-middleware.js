import * as authActions from '../actions/auth';

export const authMiddleware = store => next => action => {
    if (action &&
        action.type !== authActions.AUTHENTICATION_CHECKED &&
        action.payload &&
        action.payload.error &&
        action.payload.error.response.status === 401) {

        store.dispatch(authActions.logout(false));
    }

    return next(action);
}