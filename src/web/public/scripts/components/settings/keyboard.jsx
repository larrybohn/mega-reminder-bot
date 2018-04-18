import React, { Component } from 'react';
import KeyboardButton from './keyboard-button.jsx';
import KeyboardRow from './keyboard-row.jsx';
import './keyboard.scss';
import {v4 as uuidv4} from 'uuid';
import Octicon from 'react-octicon';

function mapButtonsToRows(buttonArray) {
    return buttonArray.map(row => ({
        id: uuidv4(),
        items: row.map(item => ({id: uuidv4(), time: item, isEditing: false}))
    }));
}

const createButton = () => ({
    id:uuidv4(),
    time: 0,
    isEditing:true,
    editingTime: 60
});

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
        newButtons[rowIndex].items[colIndex].time = newValue;
        newButtons[rowIndex].items[colIndex].isEditing = false;
        this.setState({
            ...this.state,
            buttonRows: newButtons
        });
    }

    addButton(rowIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items.push(createButton());
        this.setState({
            ...this.state,
            buttonRows: newButtons
        });
    }

    addRow() {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons.push({id: uuidv4(), items:[createButton()]});
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
        let nextButtons = this.state.buttonRows.map(row => ({
            ...row,
            items: row.items.map(item =>{
                let nextItem = {...item};
                if (item.isEditing) {
                    nextItem.time = item.editingTime;
                    nextItem.isEditing = false;
                }
                return nextItem;
            })
        }));
        this.setState({
            ...this.state,
            buttonRows: nextButtons
        }, () => this.props.save(nextButtons.map(row => row.items.map(item => item.time))));
    }

    onButtonEditModeToggle(isEditing, rowIndex, colIndex) {
        if (!isEditing && this.state.buttonRows[rowIndex].items[colIndex].time === 0) { //cancellng newly added item
            this.deleteButton(rowIndex, colIndex);
        }else{
            let nextButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
            nextButtons[rowIndex].items[colIndex].isEditing = isEditing;
            if (isEditing) {
                nextButtons[rowIndex].items[colIndex].editingTime = nextButtons[rowIndex].items[colIndex].time;
            }
            this.setState({
                ...this.state,
                buttonRows: nextButtons
            });
        }
    }

    onTimeChange(newValue, rowIndex, colIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items[colIndex].editingTime = newValue;
        this.setState({...this.state, buttonRows: newButtons});
    }

    render() {
        const rows = this.state.buttonRows.map((rowObject, rowIndex) => 
            <KeyboardRow
                key={rowObject.id}
                delete={this.state.buttonRows.length > 1 ? this.deleteRow.bind(this, rowIndex): null}
                add={this.addButton.bind(this, rowIndex)}>
                {
                    rowObject.items.map((itemObject, index) =>
                        <KeyboardButton
                            allowDebugUnits={this.props.allowDebugUnits}
                            key={itemObject.id}
                            time={itemObject.time}
                            isEditing={itemObject.isEditing}
                            editingTime={itemObject.editingTime}
                            onTimeChange={(newValue) => this.onTimeChange(newValue, rowIndex, index)}
                            onEditModeToggle={(isEditing) => this.onButtonEditModeToggle(isEditing,rowIndex,index)}
                            delete={() => this.deleteButton(rowIndex, index)}
                            update={(newValue) => this.updateButton(rowIndex, index, newValue)} />)
                }
            </KeyboardRow>
        );
        return (
            <div className="keyboard container">
                {rows}
                <div className="row">
                    <div className="col add-row-container">
                        <button type="button" className="btn btn-link" onClick={() => this.addRow()}><Octicon name="plus" />Row</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col actions-container">
                        <button type="button" className="btn btn-primary btn-save-keyboard" onClick={() => this.onSaveClick()}>
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary btn-reset-keyboard" onClick={() => this.reset()}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Keyboard;