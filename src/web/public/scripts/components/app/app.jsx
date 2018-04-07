import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

function Dashboard(props) {
    return <div></div>;
}

class App extends Component {
    constructor() {
        super();
    }
    
    render() {
        return (
            <BrowserRouter>
                <div>
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