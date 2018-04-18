import React, { Component } from 'react';
import * as TimeUtilities from '../../../../../shared/format-time';
import Octicon from 'react-octicon';

export class KeyboardButton extends Component {
    constructor(props) {
        super(props);
    }

    onDeleteClick(e) {
        this.props.delete();
        e.preventDefault();
    }

    onSaveClick(e) {
        const timeIntervalSeconds = TimeUtilities.valueWithUnitToSeconds(this.props.editingTime);
        this.props.update(timeIntervalSeconds);
        e.preventDefault();
    }

    onEditModeToggle(e, isEditing) {
        e.preventDefault();
        this.props.onEditModeToggle(isEditing);
    }

    onTimeChange(e) {
        this.props.onTimeChange(
            TimeUtilities.valueWithUnitToSeconds(e.target.value, TimeUtilities.convertToLowestUnit(this.props.editingTime).unit)
        );
    }

    onUnitChange(e) {
        this.props.onTimeChange(
            TimeUtilities.valueWithUnitToSeconds(TimeUtilities.convertToLowestUnit(this.props.editingTime).value, e.target.value)
        );
    }

    renderEditMode() {
        return (
            <div className="keyboard-button col">
                <div className="keyboard-button-editor-container">
                    <input
                        type="text"
                        value={TimeUtilities.convertToLowestUnit(this.props.editingTime).value}
                        onChange={(e) => this.onTimeChange(e)} />
                    <select
                        value={TimeUtilities.convertToLowestUnit(this.props.editingTime).unit}
                        onChange={(e) => this.onUnitChange(e)} >
                        {this.props.allowDebugUnits &&<option value="second">Seconds</option>}
                        <option value="minute">Minutes</option>
                        <option value="hour">Hours</option>
                        <option value="day">Days</option>
                    </select>
                </div>
                <div className="keyboard-button-edit-action-container">
                    <button type="button" className="btn btn-primary btn-save-button" onClick={(e) => this.onSaveClick(e, false)}>Save</button>
                    <button type="button" className="btn btn-secondary btn-cancel-button" onClick={(e) => this.onEditModeToggle(e, false)}>Cancel</button>
                </div>
            </div>
        );
    }

    renderReadMode() {
        return (
            <div className="keyboard-button col">
                {TimeUtilities.formatTimeInterval(this.props.time)}
                <div className="">
                    <a className="keyboard-button-action keyboard-button-action-edit" href="#" onClick={(e) => this.onEditModeToggle(e, true)}>
                        <Octicon name="pencil" />
                    </a>
                    <a className="keyboard-button-action keyboard-button-action-delete" href="#" onClick={(e) => this.onDeleteClick(e)}>
                        <Octicon name="trashcan" />
                    </a>
                </div>
            </div>
        );
    }

    render() {
        return this.props.isEditing ? this.renderEditMode() : this.renderReadMode();
    }
}

export default KeyboardButton;