import axios from 'axios';

export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATION_CHECKED = 'AUTHENTICATION_CHECKED';
export const AUTHENTICATION_TOKEN_RECEIVED = 'AUTHENTICATION_TOKEN_RECEIVED';

export const checkAuthentication = () => dispatch => {
    return axios.get('/auth/username')
        .then(body => {
            dispatch({
                type: AUTHENTICATION_CHECKED,
                payload: {
                    username: body.data
                }
            });
        })
        .catch(err => {
            dispatch({
                type: AUTHENTICATION_CHECKED,
                payload: {
                    username: null
                }
            });
        });
};

export const getAuthenticationToken = () => dispatch => {
    axios.get('/auth/token')
        .then(body => {
            localStorage.setItem('authtoken', body.data);
            dispatch({
                type: AUTHENTICATION_TOKEN_RECEIVED,
                payload: {
                    token: body.data
                }
            });
        })
        .catch(err => {

        });
}

export const logout = (sendLogoutRequest = true) => dispatch => {
    dispatch({
        type: LOGOUT
    });
    localStorage.removeItem('authtoken');
    if (sendLogoutRequest) {
        axios.post('/auth/logout')
            .catch(() => { });
    }
};

export const login = () => dispatch => {
    dispatch({
        type: LOGIN_SUCCESSFUL,
        payload: {
            username: '123'
        }
    });
};