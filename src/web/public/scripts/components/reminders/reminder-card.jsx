import React, { Component } from 'react';
import BusyOverlay from '../shared/busy-overlay.jsx';
import DateHelper from '../../helpers/date';
import './reminder-card.scss';

export class ReminderCard extends Component {
    constructor(props) {
        super(props);
        this.createdDate = DateHelper.utcToLocalFull(props.createdDate);
        if (props.lastSnoozeDate) {
            this.lastSnoozeDate = DateHelper.utcToLocalFull(props.lastSnoozeDate);
        }
        this.reminderTime = DateHelper.utcToFromNow((props.lastSnoozeDate || props.createdDate) + 1000*props.timeIntervalSeconds);
    }

    onDelete(e) {
        this.props.delete();
        e.preventDefault();
    }
    
    renderReminderTimeInfo() {
        if (this.reminderTime) {
            return <p>{this.reminderTime}</p>
        }else{
            return null;
        }
    }

    renderSnoozeInfo() {
        if (this.lastSnoozeDate) {
            return (
                <p>
                    Snoozed {this.props.snoozeCount} times, last time on <strong>{this.lastSnoozeDate}</strong>.
                </p>
            );
        }else{
            return null;
        }
    }

    render() {
        return (
            <div className="card reminder-card">
                <BusyOverlay isBusy={this.props.isBusy}/>
                <div className="card-body">
                    <h5 className="card-title">{this.props.summary}</h5>
                    <p className="card-text">
                        {this.renderReminderTimeInfo()}
                        Set on <strong>{this.createdDate}</strong>.
                    </p>
                    {this.renderSnoozeInfo()}
                    <a onClick={(e) => this.onDelete(e)} href="#">Delete</a>
                </div>
            </div>
        );
    }
}

export default ReminderCard;