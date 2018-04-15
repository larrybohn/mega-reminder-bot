import React, { Component } from 'react';
import './keyboard-row.scss';

export class KeyboardRow extends Component {
    constructor(props) {
        super(props);
    }

    onDeleteClick(e) {
        this.props.delete();
        e.preventDefault();
    }

    onAddClick(e) {
        this.props.add();
        e.preventDefault();
    }    

    render() {
        return (
            <div className="keyboard-row row">
                {this.props.children}
                <a className="keyboard-row-delete-link" href="#" onClick={(e) => this.onDeleteClick(e)}>Del</a>
                <a className="keyboard-row-add-link" href="#" onClick={(e) => this.onAddClick(e)}>Add</a>
            </div>
        );
    }
}

export default KeyboardRow;