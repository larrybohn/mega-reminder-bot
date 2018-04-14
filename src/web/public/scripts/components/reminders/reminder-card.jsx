import React, { Component } from 'react';
import DateHelper from '../../helpers/date';


export class ReminderCard extends Component {
    constructor(props) {
        super(props);
        this.createdDate = DateHelper.utcToLocalFull(props.createdDate);
        if (props.lastSnoozeDate) {
            this.lastSnoozeDate = DateHelper.utcToLocalFull(props.lastSnoozeDate);
        }
    }

    onDelete(e) {
        this.props.delete();
        e.preventDefault();
    }

    renderSnoozeInfo() {
        if (this.lastSnoozeDate) {
            return (
                <span>. Snoozed {this.props.snoozeCount} times, last time on <strong>{this.lastSnoozeDate}</strong>.</span>
            );
        }else{
            return null;
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{this.props.summary}</h5>
                    <p className="card-text">
                        Set on <strong>{this.createdDate}</strong>
                        {this.renderSnoozeInfo()}
                    </p>
                    <a onClick={(e) => this.onDelete(e)} href="#">Delete</a>
                </div>
            </div>
        );
    }
}

export default ReminderCard;