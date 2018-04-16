import React, { Component } from 'react';
import Keyboard from './keyboard.jsx';
import './settings.scss';
import { BusyOverlay } from '../shared/busy-overlay.jsx';

export class Settings extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.settingsActions.loadSettings();
    }

    save(keyboardData) {
        this.props.settingsActions.saveSettings({
            buttons: keyboardData,
            timezone: this.props.timezone
        });
    }

    render() {
        return (
            <div className="settings-container">
            {JSON.stringify(this.props.isLoading)}
                <BusyOverlay isBusy={this.props.isLoading}/>
                <h2>Specify Timezone</h2>
                <p>
                    ...Coming soon...
                </p>

                <h2>Customize Inline Keyboard</h2>
                <Keyboard buttons={this.props.buttons} save={(data) => this.save(data)} />
            </div>
        );
    }
}

export default Settings;