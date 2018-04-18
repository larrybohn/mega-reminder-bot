import React, { Component } from 'react';
import * as TimeUtilities from '../../../../../shared/format-time';
import Octicon from 'react-octicon';

export const KeyboardButton = (props) => {
    return props.isEditing ? 
    (
        <div className="keyboard-button col">
            <div className="keyboard-button-editor-container">
                <input
                    type="text"
                    value={props.editingTime}
                    className={props.isValid ? '' : 'error'}
                    onChange={(e) => props.onTimeChange(e)} />
                <select
                    value={props.editingUnit}
                    onChange={(e) => props.onUnitChange(e)} >
                    {props.allowDebugUnits &&<option value="second">Seconds</option>}
                    <option value="minute">Minutes</option>
                    <option value="hour">Hours</option>
                    <option value="day">Days</option>
                </select>
            </div>
            <div className="keyboard-button-edit-action-container">
                <button type="button" className="btn btn-primary btn-save-button" onClick={() => props.onSave()}>Save</button>
                <button type="button" className="btn btn-secondary btn-cancel-button" onClick={(e) => props.onEditModeToggle(e, false)}>Cancel</button>
            </div>
        </div>
    )
    :
    (
        <div className="keyboard-button col">
            {TimeUtilities.formatTimeInterval(props.time)}
            <div className="">
                <a className="keyboard-button-action keyboard-button-action-edit" href="#" onClick={(e) => props.onEditModeToggle(e, true)}>
                    <Octicon name="pencil" />
                </a>
                <a className="keyboard-button-action keyboard-button-action-delete" href="#" onClick={(e) => props.onDelete(e)}>
                    <Octicon name="trashcan" />
                </a>
            </div>
        </div>
    );
}

export default KeyboardButton;