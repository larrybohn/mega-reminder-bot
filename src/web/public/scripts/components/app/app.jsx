import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Header } from '../header/header.jsx';
import Splash from '../splash/splash.jsx';
import Reminders from '../../containers/reminders/reminders.jsx';
import Settings from '../../containers/settings/settings.jsx';

function Dashboard(props) {
    return <div></div>;
}

class App extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.authActions.checkAuthentication();
    }
    
    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <Header/>
                    <div>
                        <Route exact path="/" component={Splash} />
                        <Route path="/reminders" component={Reminders} />
                        <Route path="/settings" component={Settings} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default hot(module)(App);