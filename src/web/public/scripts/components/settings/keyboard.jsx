import React, { Component } from 'react';
import KeyboardButton from './keyboard-button.jsx';
import KeyboardRow from './keyboard-row.jsx';
import './keyboard.scss';
import {v4 as uuidv4} from 'uuid';

function mapButtonsToRows(buttonArray) {
    return buttonArray.map(row => ({
        id: uuidv4(),
        items: row.slice(0)
    }));
}

export class Keyboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonRows: mapButtonsToRows(props.buttons)
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            buttonRows: mapButtonsToRows(nextProps.buttons)
        });
    }

    deleteRow(index) {
        this.setState({
            ...this.state,
            buttonRows: [
                ...this.state.buttonRows.slice(0, index).map(a => JSON.parse(JSON.stringify(a))),
                ...this.state.buttonRows.slice(index+1).map(a => JSON.parse(JSON.stringify(a)))
            ]
        })
    }

    deleteButton(rowIndex, colIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items.splice(colIndex, 1);
        if (newButtons[rowIndex].items.length) {        
            this.setState({
                ...this.state,
                buttonRows: newButtons
            });
        }else{
            this.deleteRow(rowIndex);
        }
    }

    updateButton(rowIndex, colIndex, newValue) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items[colIndex] = newValue;
        this.setState({
            ...this.state,
            buttonRows: newButtons
        });
    }

    addButton(rowIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items.push(0);
        this.setState({
            ...this.state,
            buttonRows: newButtons
        });
    }

    addRow() {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons.push({id: uuidv4(), items:[0]});
        this.setState({
            ...this.state,
            buttonRows: newButtons
        });
    }

    reset() {
        this.setState({
            buttonRows: mapButtonsToRows(this.props.buttons)
        });
    }

    onSaveClick() {
        this.props.save(this.state.buttonRows.map(row => row.items));
    }

    render() {
        const rows = this.state.buttonRows.map((rowObject, rowIndex) => 
            <KeyboardRow
                key={rowObject.id}
                delete={this.state.buttonRows.length > 1 ? this.deleteRow.bind(this, rowIndex): null}
                add={this.addButton.bind(this, rowIndex)}>
                {
                    rowObject.items.map((item, index) =>
                        <KeyboardButton
                            key={index}
                            time={item}
                            delete={this.deleteButton.bind(this, rowIndex, index)}
                            update={this.updateButton.bind(this, rowIndex, index)} />)
                }
            </KeyboardRow>
        );
        return (
            <div className="keyboard">
                {rows}
                <button type="button" className="btn btn-link" onClick={() => this.addRow()}>+Row</button>
                <div>
                    <button type="button" className="btn btn-primary" onClick={() => this.onSaveClick()}>
                        Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => this.reset()}>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

export default Keyboard;