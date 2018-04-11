import React, { Component } from 'react';
//import './splash.scss';

export class Splash extends Component {
    render() {
        return (
            <div className="top-level-page top-level-page-splash mt-4">
                <h1>Welcome to Reminder Bot</h1>

                <p>Drop me messages, pictures or files and I will remind you about them.</p>
            </div>
        );
    }
}

export default Splash;