import React, { Component } from 'react';
import * as TimeUtilities from '../../../../../shared/format-time';

import './keyboard-button.scss';

export class KeyboardButton extends Component {
    constructor(props) {
        super(props);
        if (props.time>0) {
            this.state = {
                isEditing: false,
                time: props.time
            }
        }else{
            this.state = {
                isEditing: true,
                time: 60
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.time !== this.state.time) {
            this.setState({
                ...this.state,
                time: nextProps.time
            })
        }
    }

    onDeleteClick(e) {
        this.props.delete();
        e.preventDefault();
    }

    onSaveClick(e) {
        let multiplier;
        switch (this.unitInput.value) {
            case 'minute':
                multiplier = 60;
                break;
            case 'hour':
                multiplier = 3600;
                break;
            case 'day':
                multiplier = 24*3600;
                break;
            default:
                multiplier = 1;
        }
        const timeIntervalSeconds = this.timeInput.value * multiplier;
        this.setState({
            ...this.state,
            isEditing: false
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
                isEditing: isEditing
            });
        }
    }

    renderReadMode() {
        return (
            <div className="keyboard-button col">
                {TimeUtilities.formatTimeInterval(this.state.time)}<br/>                
                <a href="#" onClick={(e) => this.onEditModeToggle(e, true)}>Edit</a>
                <a href="#" onClick={(e) => this.onDeleteClick(e)}>Del</a>
            </div>
        );
    }

    renderEditMode() {
        return (
            <div className="keyboard-button col">
                <input type="text" defaultValue={TimeUtilities.breakIntoUnits(this.state.time)[0].value} ref={input => this.timeInput = input}/>
                <select defaultValue={TimeUtilities.breakIntoUnits(this.state.time)[0].unit} ref={input => this.unitInput = input}>
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

    render() {
        return this.state.isEditing ? this.renderEditMode() : this.renderReadMode();
    }
}

export default KeyboardButton;