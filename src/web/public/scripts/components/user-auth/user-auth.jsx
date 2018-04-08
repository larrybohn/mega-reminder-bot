import React, { Component } from 'react';
import AuthTokenChecker from './auth-token-checker.jsx';

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

    renderUserLink() {
        if (!!this.props.auth.username) {
            return <span>{this.props.auth.username}<a href="#" onClick={(e) => this.logout(e)}> (Logout)</a></span>;
        }else if (!this.props.auth.token) {
            return <a href="#" onClick={(e) => this.login(e)}>Login</a>
        }
    }

    renderTokenDialog() {
        const token = this.props.auth.token;
        if (!this.props.auth.username && !!token) {
            //todo: pass Telegram Bot Id from server!
            const telegramLink = `https://t.me/megareminderdevbot?start=${token}`;
            return (
            <div>
                To authenticatte, open <a href={telegramLink} target="_blank">Telegram Link</a> or send
                the following message to the bot: <pre>/start {token}</pre>
                <AuthTokenChecker checkAuthToken={this.props.authActions.checkAuthentication}/>
            </div>);
        }
        return null;
    }

    render() {
        return (
            <div>
                <span>{this.renderUserLink()}</span>
                {this.renderTokenDialog()}
            </div>
        );
    }
}

export default UserAuth;