import * as settingsActions from '../actions/settings';

const initialState = {
    buttons: [],
    isLoading: false
};

export default function settingsState(state = initialState, action) {
    switch (action.type) {
        case settingsActions.SETTINGS_LOADING: {
            return {...state, buttons: JSON.parse(JSON.stringify(state.buttons)), isLoading: true};
        }
        case settingsActions.SETTINGS_SAVING: {
            return {...state, ...JSON.parse(JSON.stringify(action.payload.settings)), isLoading: true};
        }
        case settingsActions.SETTINGS_LOADED: {
            return {
                ...state,
                ...JSON.parse(JSON.stringify(action.payload.settings)),
                isLoading: false
            };
        }
        case settingsActions.SETTINGS_SAVING_ERROR: {
            return {
                ...state,
                isLoading: false
            };
        }
        default:
            return state;
    }
}