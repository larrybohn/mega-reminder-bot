import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';
import logger from 'redux-logger';

export function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk, logger)
    );
}