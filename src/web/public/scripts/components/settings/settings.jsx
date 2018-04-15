import React, { Component } from 'react';
import Keyboard from './keyboard.jsx';

export class Settings extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.settingsActions.loadSettings();
    }

    render() {
        return (
            <div>
                <h2>Specify Timezone</h2>
                <p>
                    ...Coming soon...
                </p>

                <h2>Customize Inline Keyboard</h2>
                <Keyboard buttons={this.props.buttons} />
            </div>
        );
    }
}

export default Settings;