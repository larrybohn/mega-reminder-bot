import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Header } from '../header/header.jsx';

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
                    <nav>
                        <Link to="/dashboard">link</Link>
                    </nav>
                    <div>
                        <Route path="/dashboard" component={Dashboard} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default hot(module)(App);