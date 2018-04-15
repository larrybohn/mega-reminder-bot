import axios from 'axios';

export const SETTINGS_LOADED = 'SETTINGS_LOADED';
export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_LOADING_ERROR = 'SETTINGS_LOADING_ERROR';

export const loadSettings = () => dispatch => {
    dispatch({
        type: SETTINGS_LOADING
    });
    axios.get('/api/user-settings')
        .then(body => {
            dispatch({
                type: SETTINGS_LOADED,
                payload: {
                    settings: body.data
                }
            });
        })
        .catch(error => {
            dispatch({
                type: SETTINGS_LOADING_ERROR,
                payload: {
                    error
                }
            });
        });        
};