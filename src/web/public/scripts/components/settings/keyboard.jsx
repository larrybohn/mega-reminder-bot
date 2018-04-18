import React, { Component } from 'react';
import KeyboardButton from './keyboard-button.jsx';
import KeyboardRow from './keyboard-row.jsx';
import './keyboard.scss';
import {v4 as uuidv4} from 'uuid';
import Octicon from 'react-octicon';
import * as TimeUtilities from '../../../../../shared/format-time';

function mapButtonsToRows(buttonArray) {
    return buttonArray.map(row => ({
        id: uuidv4(),
        items: row.map(item => ({id: uuidv4(), time: item, isEditing: false, isValid: true}))
    }));
}

const createButton = () => ({
    id:uuidv4(),
    time: 0,
    isEditing:true,
    isValid: true,
    editingTime: 1,
    editingUnit: 'minutes'
});

const cloneButtons = (buttons) => JSON.parse(JSON.stringify(buttons));

const isButtonValid = (time) => Number(time) > 0;

export class Keyboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: true,
            buttonRows: mapButtonsToRows(props.buttons)
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({...this.state, buttonRows: mapButtonsToRows(nextProps.buttons)});
    }

    onTimeChange(e, rowIndex, colIndex) {
        let newValue = e.target.value.replace(/\D/,'');
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items[colIndex].editingTime = newValue;
        if (!this.state.isValid || !this.props.isValid) {
            newButtons[rowIndex].items[colIndex].isValid = isButtonValid(newValue);
        }
        this.setState({...this.state, buttonRows: newButtons});
        return newValue;
    }

    onUnitChange(e, rowIndex, colIndex) {
        let newButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
        newButtons[rowIndex].items[colIndex].editingUnit = e.target.value;
        this.setState({...this.state, buttonRows: newButtons});
    }

    addButton(rowIndex) {
        let newButtons = cloneButtons(this.state.buttonRows);
        newButtons[rowIndex].items.push(createButton());
        this.setState({...this.state, buttonRows: newButtons});
    }

    saveButton(rowIndex, colIndex) {
        let newButtons = cloneButtons(this.state.buttonRows);
        let button = newButtons[rowIndex].items[colIndex];
        if (isButtonValid(button.editingTime)) {
            newButtons[rowIndex].items[colIndex] = {...button, time: TimeUtilities.valueWithUnitToSeconds(button.editingTime, button.editingUnit), isEditing: false};
        }else{
            newButtons[rowIndex].items[colIndex].isValid = false;
        }
        this.setState({
            ...this.state,
            buttonRows: newButtons
        });
    }

    deleteButton(e, rowIndex, colIndex) {
        let newButtons = cloneButtons(this.state.buttonRows);
        newButtons[rowIndex].items.splice(colIndex, 1);
        if (newButtons[rowIndex].items.length) {        
            this.setState({
                ...this.state,
                buttonRows: newButtons
            });
        }else{
            this.deleteRow(rowIndex);
        }
        e.preventDefault();
    }

    addRow() {
        let newButtons = cloneButtons(this.state.buttonRows);
        newButtons.push({id: uuidv4(), items:[createButton()]});
        this.setState({...this.state, buttonRows: newButtons});
    }

    deleteRow(index) {
        this.setState({
            ...this.state,
            buttonRows: cloneButtons([
                ...this.state.buttonRows.slice(0, index),
                ...this.state.buttonRows.slice(index+1)
            ])
        })
    }

    resetForm() {
        this.setState({buttonRows: mapButtonsToRows(this.props.buttons), isValid: true});
    }

    saveForm() {
        let isValid = true;

        let nextButtons = cloneButtons(this.state.buttonRows);
        nextButtons.forEach(row => row.items.forEach(item => {
            if (item.isEditing) {
                item.isValid = isButtonValid(item.editingTime);
                isValid = isValid && item.isValid;
            }
         }));

         if (isValid) {
            nextButtons.forEach(row => row.items.forEach(item => {
                if (item.isEditing) {
                    item.time = TimeUtilities.valueWithUnitToSeconds(item.editingTime, item.editingUnit);
                    item.isEditing = false;
                }
             }));
         }

        this.setState({
            ...this.state,
            isValid: isValid,
            buttonRows: nextButtons
        }, () => isValid && this.props.save(nextButtons.map(row => row.items.map(item => item.time))));
    }

    onButtonEditModeToggle(e, isEditing, rowIndex, colIndex) {
        e.preventDefault();
        if (!isEditing && this.state.buttonRows[rowIndex].items[colIndex].time === 0) { //cancellng newly added item
            this.deleteButton(e, rowIndex, colIndex);
        }else{
            let nextButtons = JSON.parse(JSON.stringify(this.state.buttonRows));
            nextButtons[rowIndex].items[colIndex].isEditing = isEditing;
            if (isEditing) {
                const time = TimeUtilities.convertToLowestUnit(nextButtons[rowIndex].items[colIndex].time);
                nextButtons[rowIndex].items[colIndex].editingTime = time.value;
                nextButtons[rowIndex].items[colIndex].editingUnit = time.unit;
                nextButtons[rowIndex].items[colIndex].isValid = true;
            }
            this.setState({
                ...this.state,
                buttonRows: nextButtons
            });
        }
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
                            editingUnit={itemObject.editingUnit}
                            isValid={itemObject.isValid}
                            onTimeChange={(e) => this.onTimeChange(e, rowIndex, index)}
                            onUnitChange={(e) => this.onUnitChange(e, rowIndex, index)}
                            onEditModeToggle={(e, isEditing) => this.onButtonEditModeToggle(e, isEditing, rowIndex, index)}
                            onDelete={(e) => this.deleteButton(e, rowIndex, index)}
                            onSave={() => this.saveButton(rowIndex, index)} />)
                }
            </KeyboardRow>
        );
        return (
            <div className="keyboard container">
                <div className={this.state.isValid ? '' : 'error'}>
                {rows}
                </div>
                <div className="row">
                    <div className="col add-row-container">
                        <button type="button" className="btn btn-link" onClick={() => this.addRow()}><Octicon name="plus" />Row</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col actions-container">
                        {!this.state.isValid && <p className="error-message"><Octicon name="alert"/> Please correct the errors.</p>}
                        <button type="button" className="btn btn-primary btn-save-keyboard" onClick={() => this.saveForm()}>
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary btn-reset-keyboard" onClick={() => this.resetForm()}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Keyboard;