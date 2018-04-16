import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from '../../components/settings/settings.jsx';
import * as settingsActions from '../../actions/settings';

const mapStateToProps = state => ({...state.settings});

const mapDispatchToProps = dispatch => ({
    settingsActions: bindActionCreators(settingsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);