import React, { Component } from 'react';
import Octicon from 'react-octicon';

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
            <div className="row keyboard-row">
                {this.props.children}
                <div className="col keyboard-row-action-column">
                    {
                        (typeof this.props.delete === 'function') &&
                        <a className="keyboard-row-delete-link" href="#" onClick={(e) => this.onDeleteClick(e)}>
                            <Octicon name="trashcan" />
                        </a>
                    }
                    <a className="keyboard-row-add-link" href="#" onClick={(e) => this.onAddClick(e)}>
                        <Octicon name="plus" />
                    </a>
                </div>
            </div>
        );
    }
}

export default KeyboardRow;