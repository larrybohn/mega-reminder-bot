import React, { Component } from 'react';
import AuthTokenChecker from './auth-token-checker.jsx';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './user-auth.scss';

export class UserAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    logout(e) {
        e.preventDefault();
        this.props.authActions.logout();
    }

    login(e) {
        e.preventDefault();
        this.props.authActions.getAuthenticationToken();
    }

    abortLogin() {
        this.props.authActions.logout();
    }

    renderUserLink() {
        if (!!this.props.auth.username) {
            return (
                <span className="ml-auto">
                    <strong>{this.props.auth.username}</strong><a href="#" onClick={(e) => this.logout(e)}> (Logout)</a>
                </span>
            );
        } else if (!this.props.auth.token) {
            return <a className="ml-auto" href="#" onClick={(e) => this.login(e)}>Login</a>
        }
    }

    renderTokenDialog() {
        const token = this.props.auth.token;
        if (!this.props.auth.username && !!token) {
            //todo: pass Telegram Bot Id from server!
            const telegramLink = `https://t.me/${this.props.definitions.telegramBotId}?start=${token}`;
            return (
                <Modal isOpen={true}>
                    <ModalHeader>Signing in...</ModalHeader>
                    <ModalBody>
                        To authenticate, open <a href={telegramLink} target="_blank">Telegram Link</a> and click Start in the Telegram chat, or send
                        the following message to the bot:<br/>
                        <code>/start {token}</code>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.abortLogin() }}>Cancel</Button>
                    </ModalFooter>
                    <AuthTokenChecker checkAuthToken={this.props.authActions.checkAuthentication} />
                </Modal>
            );
        }
        return null;
    }

    renderNavLinks() {
        if (!!this.props.auth.username) {
            return (
                <React.Fragment>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/reminders">Reminders</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/settings">Settings</NavLink>
                    </li>
                </React.Fragment>
            );
        }
        return null;
    }

    render() {
        return (
            <div className="collapse navbar-collapse" id="header-navbar-content">
                <ul className="nav nav-pills">
                    {this.renderNavLinks()}
                </ul>
                {this.renderUserLink()}
                {this.renderTokenDialog()}            
            </div>
        );
    }
}

export default UserAuth;