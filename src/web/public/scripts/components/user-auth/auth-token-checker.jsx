import React, { Component } from 'react';
import PropTypes from 'prop-types';

const intervalMilliseconds = 2000;

export class AuthTokenChecker extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.intervalId = setInterval(this.props.checkAuthToken, intervalMilliseconds);
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    render() {
        return null;
    }
}
AuthTokenChecker.propTypes = {
    checkAuthToken: PropTypes.func
};

export default AuthTokenChecker;