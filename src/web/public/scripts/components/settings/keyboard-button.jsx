import React, { Component } from 'react';
import * as TimeUtilities from '../../../../../shared/format-time';

import './keyboard-button.scss';

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
            {/*JSON.stringify(this.state)*/}
                <input
                    type="text"
                    value={TimeUtilities.convertToLowestUnit(this.props.editingTime).value}
                    onChange={(e) => this.onTimeChange(e)} />
                <select
                    value={TimeUtilities.convertToLowestUnit(this.props.editingTime).unit}
                    onChange={(e) => this.onUnitChange(e)} >
                    <option value="second">Seconds</option> {/* todo: pass config from server, allow Seconds only in development */}
                    <option value="minute">Minutes</option>
                    <option value="hour">Hours</option>
                    <option value="day">Days</option>
                </select>
                <br/>
                <a href="#" onClick={(e) => this.onSaveClick(e, false)}>Save</a>
                <a href="#" onClick={(e) => this.onEditModeToggle(e, false)}>Cancel</a>
            </div>
        );
    }

    renderReadMode() {
        return (
            <div className="keyboard-button col">
            {/*JSON.stringify(this.props)*/}
                {TimeUtilities.formatTimeInterval(this.props.time)}<br/>                
                <a href="#" onClick={(e) => this.onEditModeToggle(e, true)}>Edit</a>
                <a href="#" onClick={(e) => this.onDeleteClick(e)}>Del</a>
            </div>
        );
    }

    render() {
        return this.props.isEditing ? this.renderEditMode() : this.renderReadMode();
    }
}

export default KeyboardButton;