import React, { Component } from 'react';
import './busy-overlay.scss';
import spinnerImage from '../../../images/fidget-spinner-loading.gif';

export function BusyOverlay(props) {
    if (props.isBusy === true) {
        return (
            <div className="busy-overlay">
                <img src={spinnerImage}/>
            </div>
        );
    }
    return null;
}

export default BusyOverlay;