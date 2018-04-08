import * as authActions from '../actions/auth';

const initialState = {
    username: null,
    token: null
};

export default function authState(state = initialState, action) {
    switch(action.type) {
        case authActions.AUTHENTICATION_CHECKED:
            return {
                ...state,
                username: action.payload.username
            }
        case authActions.AUTHENTICATION_TOKEN_RECEIVED:
            return {
                ...state,
                username: null,
                token: action.payload.token
            }
        case authActions.LOGOUT:
            return {
                ...state,
                username: null,
                token: null
            }
        case authActions.LOGIN_SUCCESSFUL:
            return {
                ...state,
                userId: action.payload.username
            }
        default:
            return state;
    }
}