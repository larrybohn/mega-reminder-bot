import * as definitionsActions from '../actions/definitions';

const initialState = {
    definitions: null,
    hasError: false
};

export default function definitionssState(state = initialState, action) {
    switch (action.type) {
        case definitionsActions.DEFINITIONS_LOADED:
            return {...state, definitions: action.payload, hasError: false};
        case definitionsActions.DEFINITIONS_LOADING_ERROR:
            return {...state, hasError: true};
        default:
            return state;
    }
}