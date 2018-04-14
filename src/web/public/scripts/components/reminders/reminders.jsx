import React, { Component } from 'react';
import ReminderCard from './reminder-card.jsx';

export class Reminders extends Component {
    constructor() {
        super();
    }
    componentWillMount() {
        this.props.reminderActions.loadReminders();
    }

    deleteReminder(reminderId) {
        this.props.reminderActions.deleteReminder(reminderId);
    }

    renderUpcoming() {
        return this.props.reminders.map(reminder => {
            if (!reminder.isCompleted) {
                return <ReminderCard {...reminder} key={reminder._id} delete={() => this.deleteReminder(reminder._id)}/>
            }else{
                return null;
            }
        });
    }

    renderCompleted() {
        return this.props.reminders.map(reminder => {
            if (reminder.isCompleted) {
                return <ReminderCard {...reminder} key={reminder._id} delete={() => this.deleteReminder(reminder._id)} />
            }else{
                return null;
            }
        });
    }

    render() {
        if (this.props.isLoading) {
            return (<div>Loading...</div>);
        } else if (!!this.props.reminders) {
            return (
                <div>
                    <h2>Upcoming reminders</h2>
                    <div>
                        {this.renderUpcoming()}
                    </div>

                    <h2>Completed reminders</h2>
                    <div>
                        {this.renderCompleted()}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Reminders;