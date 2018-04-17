import axios from 'axios';

export const DEFINITIONS_LOADED = 'DEFINITIONS_LOADED';
export const DEFINITIONS_LOADING_ERROR = 'DEFINITIONS_LOADING_ERROR';

export const loadDefinitions = () => dispatch => {
    axios.get('/api/definitions').then((body) => {
        dispatch({
            type: DEFINITIONS_LOADED,
            payload: body.data
        });
    }).catch(error => {
        dispatch({
            type: DEFINITIONS_LOADING_ERROR,
            payload: { error }
        });
    });
}