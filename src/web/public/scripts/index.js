import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './store';
import App from './containers/app/app.jsx';

import axios from 'axios';
import * as definitionsActions from './actions/definitions';
import * as authActions from './actions/auth';

const store = configureStore();

import "../styles/index.scss";
import 'bootstrap';
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authtoken');
    if (token) {
        return {
            ...config,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    }
    return config;
  });

const initialLoadPromises = [
    definitionsActions.loadDefinitions()(store.dispatch),
    authActions.checkAuthentication()(store.dispatch)
];

Promise.all(initialLoadPromises).then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
});