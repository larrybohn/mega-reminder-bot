import React, { Component } from 'react';
import UserAuth from '../../containers/user-auth/user-auth.jsx';
//import { Navbar, NavbarBrand } from 'reactstrap';

export class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-light bg-light justify-content-between">
                <span className="navbar-brand">Reminder Bot</span>
                <UserAuth/>
            </nav>
        );
    }
}

export default Header;