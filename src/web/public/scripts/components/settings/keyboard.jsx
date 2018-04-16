import React, { Component } from 'react';
import KeyboardButton from './keyboard-button.jsx';
import KeyboardRow from './keyboard-row.jsx';
import './keyboard.scss';

export class Keyboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: JSON.parse(JSON.stringify(props.buttons))
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            buttons: JSON.parse(JSON.stringify(nextProps.buttons))
        });
    }

    deleteRow(index) {
        this.setState({
            ...this.state,
            buttons: [
                ...this.state.buttons.slice(0, index).map(a => a.slice(0)),
                ...this.state.buttons.slice(index+1).map(a => a.slice(0))
            ]
        })
    }

    deleteButton(rowIndex, colIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttons));
        newButtons[rowIndex].splice(colIndex, 1);
        if (newButtons[rowIndex].length) {        
            this.setState({
                ...this.state,
                buttons: newButtons
            });
        }else{
            this.deleteRow(rowIndex);
        }
    }

    updateButton(rowIndex, colIndex, newValue) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttons));
        newButtons[rowIndex][colIndex] = newValue;
        this.setState({
            ...this.state,
            buttons: newButtons
        });
    }

    addButton(rowIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttons));
        newButtons[rowIndex].push(0);
        this.setState({
            ...this.state,
            buttons: newButtons
        });
    }

    addRow() {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttons));
        newButtons.push([0]);
        this.setState({
            ...this.state,
            buttons: newButtons
        });
    }

    reset() {
        this.setState({
            buttons: JSON.parse(JSON.stringify(this.props.buttons))
        });
    }    

    render() {
        const rows = this.state.buttons.map((row, rowIndex) => 
            <KeyboardRow
                key={rowIndex}
                delete={this.deleteRow.bind(this, rowIndex)}
                add={this.addButton.bind(this, rowIndex)}>
                {
                    row.map((item, index) =>
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
                <button type="button" class="btn btn-link" onClick={() => this.addRow()}>+Row</button>
                <div>
                    <button type="button" class="btn btn-primary" onClick={() => this.props.save(this.state.buttons)}>
                        Save
                    </button>
                    <button type="button" class="btn btn-secondary" onClick={() => this.reset()}>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

export default Keyboard;