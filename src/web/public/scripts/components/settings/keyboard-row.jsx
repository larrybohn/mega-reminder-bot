import React, { Component } from 'react';
import Octicon from 'react-octicon';

const KeyboardRow = (props) => {
    function onDeleteClick(e) {
        props.delete();
        e.preventDefault();
    }

    function onAddClick(e) {
        props.add();
        e.preventDefault();
    } 
    
    return (
        <div className="row keyboard-row">
            {props.children}
            <div className="col keyboard-row-action-column">
                {
                    (typeof props.delete === 'function') &&
                    <a className="keyboard-row-delete-link" href="#" onClick={(e) => onDeleteClick(e)}>
                        <Octicon name="trashcan" />
                    </a>
                }
                <a className="keyboard-row-add-link" href="#" onClick={(e) => onAddClick(e)}>
                    <Octicon name="plus" />
                </a>
            </div>
        </div>
    );
}

export default KeyboardRow;