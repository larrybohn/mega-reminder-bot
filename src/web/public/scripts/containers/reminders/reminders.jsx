import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Reminders from '../../components/reminders/reminders.jsx';
import * as reminderActions from '../../actions/reminders';

const mapStateToProps = state => state.reminders;

const mapDispatchToProps = dispatch => ({
    reminderActions: bindActionCreators(reminderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Reminders);