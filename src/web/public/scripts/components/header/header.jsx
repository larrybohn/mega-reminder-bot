import React, { Component } from 'react';
import UserAuth from '../../containers/user-auth/user-auth.jsx';
import logoImage from '../../../images/telegram-icon.png';
import './header.scss';
//import { Navbar, NavbarBrand } from 'reactstrap';

export class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="navbar-brand">
                    <img className="bot-logo" src={logoImage}/>
                    Reminder Bot
                </div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#header-navbar-content">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <UserAuth />
            </nav>
        );
    }
}

export default Header;