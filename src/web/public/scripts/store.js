import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';
import logger from 'redux-logger';
import { authMiddleware } from './middleware/auth-middleware';

export function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk, authMiddleware, logger)
    );
}