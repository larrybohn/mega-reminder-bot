import React, { Component } from 'react';
import * as TimeUtilities from '../../../../../shared/format-time';

import './keyboard-button.scss';

function mapPropsToState(props) {
    const DEFAULT_TIME_INTERVAL = 60;
    const time = props.time === 0 ? DEFAULT_TIME_INTERVAL : props.time;
    return {        
        isEditing: props.time === 0,
        editingTime: TimeUtilities.breakIntoUnits(time)[0].value,
        editingUnit: TimeUtilities.breakIntoUnits(time)[0].unit
    };
}

export class KeyboardButton extends Component {
    constructor(props) {
        super(props);
        this.state = mapPropsToState(props);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.time !== this.state.time) {
            this.setState({...this.state, time: nextProps.time});
        }
    }

    onDeleteClick(e) {
        this.props.delete();
        e.preventDefault();
    }

    onSaveClick(e) {
        const timeIntervalSeconds = TimeUtilities.valueWithUnitToSeconds(this.state.editingTime, this.state.editingUnit);
        this.setState({
            ...this.state,
            isEditing: false,
            time: timeIntervalSeconds
        }, () => {this.props.update(timeIntervalSeconds)});
        e.preventDefault();
    }

    onEditModeToggle(e, isEditing) {
        e.preventDefault();
        if (!isEditing && this.props.time === 0) { //cancellng newly added item
            this.props.delete();
        }else{
            this.setState({
                ...this.state,
                isEditing: isEditing,
                editingTime: TimeUtilities.breakIntoUnits(this.props.time)[0].value,
                editingUnit: TimeUtilities.breakIntoUnits(this.props.time)[0].unit
            });
        }
    }

    onTimeChange(e) {
        this.setState({...this.state, editingTime: e.target.value});
    }

    onUnitChange(e) {
        this.setState({...this.state, editingUnit: e.target.value});
    }

    renderEditMode() {
        return (
            <div className="keyboard-button col">
                <input
                    type="text"
                    value={this.state.editingTime}
                    onChange={(e) => this.onTimeChange(e)} />
                <select
                    value={this.state.editingUnit}
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
                {TimeUtilities.formatTimeInterval(this.props.time)}<br/>                
                <a href="#" onClick={(e) => this.onEditModeToggle(e, true)}>Edit</a>
                <a href="#" onClick={(e) => this.onDeleteClick(e)}>Del</a>
            </div>
        );
    }

    render() {
        return this.state.isEditing ? this.renderEditMode() : this.renderReadMode();
    }
}

export default KeyboardButton;