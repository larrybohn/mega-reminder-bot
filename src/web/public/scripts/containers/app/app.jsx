import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../../components/app/app.jsx';
import * as authActions from '../../actions/auth';

class AppContainer extends Component {
    render() {
        return <App {...this.props} />;
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);