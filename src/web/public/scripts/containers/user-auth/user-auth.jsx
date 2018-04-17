import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UserAuth from '../../components/user-auth/user-auth.jsx';
import * as authActions from '../../actions/auth';
import { withRouter } from 'react-router';

class UserAuthContainer extends Component {
    render() {
        return <UserAuth {...this.props} />;
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    definitions: state.definitions.definitions
});

const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserAuthContainer));