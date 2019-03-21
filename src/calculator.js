import React, { Component } from 'react';

/**
 * A simple project to learn and study ReactJS. The goal is to create a simple and functional ReactJS calculator app
 * which can perform basic mathematical functions.
 *
 * This is my first project developing with ReactJS; I started with 0 knowledge of ReactJS and learned as I went along.
 * I decided to not follow any tutorials during this project because I did not want to copy and paste someone else's
 * work, everything seen is a result of my own research and study into the ReactJS library.
 *
 * This project was developed using Jetbrains PhpStorm IDE.
 */

// TODO: Style calculator
// TODO: -> should move history into current operations.
// TODO: apply usage for +/-

//TODO: code cleanup

export default class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            operations: "",
            result: "",
            history: ""
        }
    }
    render() {
        return (
            <div>
                <div class="frame">
                    <div class="screen">
                        <div className="screen_result">
                            {this.state.result}
                        </div>
                        <div class="screen_input">
                            {this.state.operations}
                        </div>
                        <div class="screen_history">
                            {this.state.history}
                        </div>
                    </div>
                    <div class="buttons">
                        {this.renderInputButton('7')}
                        {this.renderInputButton('8')}
                        {this.renderInputButton('9')}
                        {this.renderOperationButton('+/-')}
                        {this.renderOperationButton('->')}
                        {this.renderInputButton('4')}
                        {this.renderInputButton('5')}
                        {this.renderInputButton('6')}
                        {this.renderOperationButton('X')}
                        {this.renderOperationButton('/')}
                        {this.renderInputButton('1')}
                        {this.renderInputButton('2')}
                        {this.renderInputButton('3')}
                        {this.renderOperationButton('-')}
                        {this.renderOperationButton('=')}
                        {this.renderOperationButton('C')}
                        {this.renderInputButton('0')}
                        {this.renderInputButton('.')}
                        {this.renderOperationButton('+')}
                    </div>
                </div>
            </div>
        )
    }

    handleClick(c, isOperation) {
        let newOperations = this.state.operations;

        if (isOperation) {
            // Clear operation
            if (c === 'C') {
                this.setState({operations: ""});
                this.setState({result: ""});
                return;
            }
            else if ( c === '+/-' ) {
                return;
            }
            else if ( c === '->' ) {
                return;
            }
            else {
                if ( c !== '=') {
                   newOperations = newOperations + c;
                }
                else {
                    this.setState({operations: parseString(newOperations + '=')});
                    this.setState({history: newOperations});
                    return;
                }
            }
        }
        else {
            newOperations = newOperations + c;
        }

        this.setState({operations: newOperations});
        this.setState({result: ""});
        let result = parseString(newOperations + '=');
        this.setState({result: result});

    }

    renderInputButton(c) {
        return (
          <CalculatorButton
              isOperation={false}
              text={c}
              onClick={() => this.handleClick(c, false)}
          />
        );
    }

    renderOperationButton(c) {
        return (
            <CalculatorButton
                isOperation={true}
                text={c}
                onClick={() => this.handleClick(c, true)}
            />
        );
    }

}


class CalculatorButton extends Component {
    render() {
        return (
            <button
                className={(this.props.text !== '=') ?"calculator_button" : "calculator_button_big"}
                onClick={() => this.props.onClick()}
            >
                {this.props.text}
            </button>
        );
    }
}

function parseString(input) {
    let result = 0;

    let inputs = [];
    let inputIndex = 0;
    let tempStorage = [];
    let tempIndex = 0;

    let operations = [];
    let operationsIndex = 0;

    for (let i = 0; i < input.length; i++) {
        let translatedCharacter = input.charCodeAt(i) - 48;

        if ((translatedCharacter >= 0 && translatedCharacter <= 9) || input[i] === '.') {
            // add number to tempStorage
            if (input[i] !== '.') {
                tempStorage[tempIndex] = translatedCharacter;
            }
            else {
                tempStorage[tempIndex] = input[i];
            }
            tempIndex++;
        }
        else {
            // add operation to operations array
            operations[operationsIndex] = input[i];
            operationsIndex++;

            // convert tempStorage to a number
            inputs[inputIndex] = Number.parseFloat(tempStorage.join('').toString());
            inputIndex++;

            // clear tempStorage
            tempIndex = 0;
            tempStorage = [];
        }
    }

    operationsIndex = 0;
    result = inputs[0];
    inputIndex = 1;

    while(operations[operationsIndex] !== '=') {
        result = performOperation(operations[operationsIndex], result, inputs[inputIndex]);
        operationsIndex++;
        inputIndex++;
    }

    return result;
}

function performOperation(operation, cur, val) {
    if (cur.isNaN) {
        cur = 0;
    }
    if (val.isNaN) {
        val = 0;
    }

    switch(operation) {
        case '+':
            return (cur + val);
        case '-':
            return (cur - val);
        case 'X':
            return (cur * val);
        case '/':
            return (cur / val);
        default:
            return cur;
    }
}
