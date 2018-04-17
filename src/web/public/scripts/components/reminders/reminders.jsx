import React, { Component } from 'react';
import ReminderCard from './reminder-card.jsx';

export class Reminders extends Component {
    constructor() {
        super();
    }
    componentWillMount() {
        if (this.props.reminders === null) {
            this.props.reminderActions.loadReminders();
        }
    }

    deleteReminder(reminderId) {
        this.props.reminderActions.deleteReminder(reminderId);
    }

    renderReminderSection(title, predicate) {
        const reminders = this.props.reminders.reduce((renderedReminders, reminder) => {
            if (predicate(reminder)) {
                renderedReminders.push(<ReminderCard {...reminder} key={reminder._id} delete={() => this.deleteReminder(reminder._id)}/>);
            }
            return renderedReminders;
        }, []);
        if (reminders.length) {
            return reminders;
        }else{
            return <p>No {title} reminders</p>
        }
    }

    renderUpcoming() {
        return this.renderReminderSection('upcoming', reminder => !reminder.isCompleted);
    }

    renderCompleted() {
        return this.renderReminderSection('completed', reminder => reminder.isCompleted);
    }

    /*onReloadClick(e) {
        this.props.reminderActions.loadReminders();
        e.preventDefault();
    }*/

    render() {
        if (this.props.isLoading) {
            return (<div>Loading...</div>);
        } else if (!!this.props.reminders) {
            return (
                <div>
                    {/*<a href="#" onClick={(e) => this.onReloadClick(e)}>Reload</a>*/}
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