import axios from 'axios';

export const SETTINGS_LOADED = 'SETTINGS_LOADED';
export const SETTINGS_LOADING = 'SETTINGS_LOADING';
export const SETTINGS_LOADING_ERROR = 'SETTINGS_LOADING_ERROR';
export const SETTINGS_SAVING = 'SETTINGS_SAVING';
export const SETTINGS_SAVING_ERROR = 'SETTINGS_SAVING_ERROR';

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

export const saveSettings = (settings) => dispatch => {
    dispatch({
        type: SETTINGS_SAVING,
        payload: {
            settings
        }
    });
    axios.post('/api/user-settings', settings)
        .then(body => {
            dispatch({
                type: SETTINGS_LOADED,
                payload: {
                    settings
                }
            });
        })
        .catch(error => {
            //todo: display toastr
            dispatch({
                type: SETTINGS_SAVING_ERROR,
                payload: {
                    error
                }
            });
        });
};