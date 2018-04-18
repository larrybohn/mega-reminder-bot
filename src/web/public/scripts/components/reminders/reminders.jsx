import React, { Component } from 'react';
import ReminderCard from './reminder-card.jsx';
import Pager from './pager.jsx';
import './reminders.scss';
import { BusyOverlay } from '../shared/busy-overlay.jsx';

export class Reminders extends Component {
    constructor() {
        super();
    }
    componentWillMount() {
        //if (this.props.reminders === null) {
        this.props.reminderActions.loadAllReminders();
        //}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.key && this.props.location.key !== nextProps.location.key) {
            this.props.reminderActions.loadAllReminders();
        }
    }

    deleteReminder(reminderId, type) {
        this.props.reminderActions.deleteReminder(reminderId, type);
    }

    onPageClick(type, page) {
        this.props.reminderActions.loadReminders(type, page);
    }

    renderReminderSection(type) {
        let renderedSection;
        const reminderProp = this.props[type];
        if (reminderProp && reminderProp.reminders && reminderProp.reminders.length) {
            renderedSection = (
                <div className="reminder-section-container">
                    <BusyOverlay isBusy={reminderProp.isLoading}/>
                    {reminderProp.reminders.map(reminder =>
                        <ReminderCard {...reminder} key={reminder._id} delete={() => this.deleteReminder(reminder._id, type)}/>)}
                    <Pager
                        totalPages={reminderProp.totalPages}
                        currentPage={reminderProp.currentPage}
                        onPageClick={(page) => this.onPageClick(type, page)} />
                </div>
            );
        }else{
            renderedSection = <div><p>No {type} reminders</p></div>
        }

        return (
            <div>
                <h2>{type[0].toUpperCase() + type.slice(1)} reminders</h2>
                {renderedSection}
            </div>
        );
    }

    /*onReloadClick(e) {
        this.props.reminderActions.loadReminders();
        e.preventDefault();
    }*/

    render() {
        if (this.props.isLoading) {
            return (<div>Loading...</div>);
        }
        return (
            <div>
                {this.renderReminderSection('upcoming')}
                {this.renderReminderSection('completed')}
            </div>
        );
    }
}

export default Reminders;