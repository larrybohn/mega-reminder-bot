import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Header } from '../header/header.jsx';
import Splash from '../splash/splash.jsx';
import Reminders from '../../containers/reminders/reminders.jsx';
import Settings from '../../containers/settings/settings.jsx';

const PrivateRoute = ({ component: Component, username, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        username === null ? (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
        ) : (
            <Component {...props} />
        )
      }
    />
  );

class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <Header/>
                    <div>
                        <Route exact path="/" component={Splash} />
                        <PrivateRoute username={this.props.auth.username} path="/reminders" component={Reminders} />
                        <PrivateRoute username={this.props.auth.username} path="/settings" component={Settings} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default hot(module)(App);