import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UserAuth from '../../components/user-auth/user-auth.jsx';
import * as authActions from '../../actions/auth';

class UserAuthContainer extends Component {
    render() {
        return <UserAuth {...this.props} />;
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthContainer);