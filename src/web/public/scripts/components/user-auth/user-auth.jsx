import React, { Component } from 'react';
import AuthTokenChecker from './auth-token-checker.jsx';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class UserAuth extends Component {
    constructor(props) {
        super(props);
        console.log(props);
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
            return <span>{this.props.auth.username}<a href="#" onClick={(e) => this.logout(e)}> (Logout)</a></span>;
        } else if (!this.props.auth.token) {
            return <a href="#" onClick={(e) => this.login(e)}>Login</a>
        }
    }

    renderTokenDialog() {
        const token = this.props.auth.token;
        if (!this.props.auth.username && !!token) {
            //todo: pass Telegram Bot Id from server!
            const telegramLink = `https://t.me/megareminderdevbot?start=${token}`;
            return (
                <Modal isOpen={true}>
                    <ModalHeader>Modal title</ModalHeader>
                    <ModalBody>
                        To authenticatte, open <a href={telegramLink} target="_blank">Telegram Link</a> or send
                        the following message to the bot: <pre>/start {token}</pre>
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
        if (this.props.auth.username) {
            return (
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Reminders</a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Timezone</a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Customize Keyboard</a>
                    </li>
                </ul>
            );
        }
        return null;
    }

    render() {
        return (
            <span>
                {this.renderNavLinks()}
                <span>{this.renderUserLink()}</span>
                {this.renderTokenDialog()}
            </span>
        );
    }
}

export default UserAuth;