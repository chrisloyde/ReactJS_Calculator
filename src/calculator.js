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

// TODO: Improve style (maybe colored buttons?)
// TODO: cleanup index.html, add favicon, meta, etc.

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
                <div className="frame">
                    <div className="screen">
                        <div className="screen_result">
                            {this.state.result}
                        </div>
                        <div className="screen_input">
                            {this.state.operations}
                        </div>
                        <div className="screen_history">
                            {this.state.history}
                        </div>
                    </div>
                    <div className="buttons">
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
                    version: 1.0.1
                </div>
            </div>
        )
    }

    /**
     * Handle's input from user to calculate and display results.
     *
     * @param c :value from calculator input that needs to be checked.
     * @param isOperation :operation represents anything that is not a number.
     */
    handleClick(c, isOperation) {
        let newOperations = this.state.operations;

        if (isOperation) {
            if (c === 'C') {
                this.setState({operations: ""});
                this.setState({result: ""});
                return;
            }
            else if ( c === '+/-' ) {
                newOperations = insertPlusMinus(newOperations);
            }

            else if ( c === '->' ) {
                if (this.state.history.toString().length > 0) {
                    newOperations = this.state.history;
                    this.setState({operations: newOperations});
                    this.setState({history: ''});
                }
            }
            else if (c === '='){
                this.setState({history: newOperations});
            }
            else {
                // if operation is an operation that should be displayed, display it.
                newOperations = newOperations + c;
            }
        }
        else {
            // display everything that is not an operation.
            newOperations = newOperations + c;
        }

        // update operations state to newOperations. This updates the screen to the calculated result.
        this.setState({operations: newOperations});
        this.setState({result: ""});
        // S and =s are added after the fact os parseString knows how to read the operation.
        // S represents the start, equals represents the end.
        // A 0 is added directly after S to give a "starting number" so starting negative numbers are evaluated
        // properly for multiplication and division.
        let result = parseString('S0'+newOperations+'=');
        this.setState({result: result});

    }

    renderInputButton(c) {
        return (
          <CalculatorButton
              isOperation={false}
              text={c}
              onClick={() => this.handleClick(c, false)} // function passed to parent Calculator.
          />
        );
    }

    renderOperationButton(c) {
        return (
            <CalculatorButton
                isOperation={true}
                text={c}
                onClick={() => this.handleClick(c, true)} // function passed to parent Calculator.
            />
        );
    }

}


/**
 * Class for a calculator button.
 * Holds its own text value (what is displayed on the calculator) and passes it's onClick event to the caller.
 */
class CalculatorButton extends Component {
    render() {
        return (
            <button
                // determine which div class to use based on button value.
                className={(this.props.text !== '=') ?"calculator_button" : "calculator_button_big"}
                onClick={() => this.props.onClick()}
            >
                {this.props.text}
            </button>
        );
    }
}

/**
 * The insertPlustMinus (+/- button) function is used to change the most recent
 * number from positive to negative, or change evaluation from addition to subtraction.
 *
 * Parses through @param inputStr from the end to the start, when it comes across the first operator it decides
 * whether it needs to change the sign (from + to - or vice versa) or add a negative sign.
 *
 * @param inputStr :String to have modified.
 * @returns {string} :The modified string.
 */
function insertPlusMinus(inputStr) {
    let copyStr = "";
    for (let i = inputStr.length-1; i >= 0; i--) {
        let character = inputStr[i];
        let translatedCharacter = inputStr.charCodeAt(i) - 48;

        // Ignore numbers, decimals, or the = sign since they aren't relevant.
        if (translatedCharacter >= 0 && translatedCharacter <= 9) {
            continue;
        }

        if (character === '.') {
            continue;
        }

        if (character === '=') {
            continue;
        }

        // On first operator found determine what needs to happen.
        copyStr = inputStr.substr(0, i); // get a substring from the beginning of @param inputStr to operator index.

        // Swap signs if operator is a + sign, this transforms addition to subtraction.
        if (inputStr[i] === '+') {
            copyStr += '-';
        }

        // Swap sign if operator is a - sign. However this should not be done if the - represents a negative number.
        // Since positive numbers are not represented by the + sign, one is not appended to replace a negative sign.
        // Note that the length is also checked, this is to ensure that a positive sign is not appended at the start
        // of the inputStr when changing from a negative starting value to a positive starting value.
        // This transforms subtraction into addition.
        else if (inputStr[i] === '-' && inputStr[i-1] !== 'X' && inputStr[i-1] !== '/' && inputStr.length > 2) {
            alert(inputStr);
            copyStr += '+';
        }

        // This last statement inputs a - sign to change a positive number to a negative number.
        // The previous if checks (to check for multiplication, division, and string length) are added to avoid adding
        // additional - signs when the above conditional fails.
        else if (inputStr[i-1] !== 'X' && inputStr[i-1] !== '/' && inputStr.length > 2) {
            copyStr += (inputStr[i] + '-');
        }

        // Append the rest of @param inputStr after our string.
        copyStr += (inputStr.substr(i+1, inputStr.length));

        return copyStr; // return the new string.
    }

    // If no modifiable operator was found, append - sign at the beginning, to indicate a starting negative number.
    return ('-' + inputStr);
}

/**
 * Parses a string, searches for operations and numerical inputs, then calculates the string.
 *
 * @param inputStr :String representing a calculation.
 * @returns {*} :Result of calculation.
 */
function parseString(inputStr) {

    let tempStorage = []; // Temporary storage which will be used to transform a "string" into a number.
    let tempIndex = 0;

    let inputs = []; // Inputs in the evaluation.
    let inputsIndex = 0;

    let operations = []; // Operations in the evaluation (ignores =, S, and -.
    let operationsIndex = 0;

    let num = 0;

    // String is parsed backwards so negatives can be properly applied.
    for (let i = inputStr.length-1; i >= 0; i--) {
        let character = inputStr[i]; // character is the ASCII representation.
        let translatedCharacter = inputStr.charCodeAt(i) - 48; // translated character is the real number.

        // If translated character is a number or if the character is a decimal then we treat it as a number.
        if ((translatedCharacter >= 0 && translatedCharacter <= 9) || character === '.') {
            if (character === '.') {
                tempStorage[tempIndex] = character; // decimals are stored as is.
            }
            else {
                tempStorage[tempIndex] = translatedCharacter; // store translated characters.
            }
            tempIndex++;
        }
        else {
            // Ignore '=' character.
            if (character === '=') {
                continue;
            }

            // Ignore S and -, and add any other operations to operations array.
            if (character !== 'S' && character !== '-') {
                operations[operationsIndex] = character;
                operationsIndex++;
            }

            // If tempStorage holds a number
            if (tempIndex > 0) {
                // tempStorage is parsed into a float so the calculator can handle decimal evaluations.
                num = Number.parseFloat(tempStorage.reverse().join('').toString());

                // If the current character is a - sign, the parsed number is converted to negative.
                // The calculator will then handle subtraction as adding a positive number to a negative number.
                if (character === '-') {
                    // If a multiplication or division sign is seen just ahead of the operator (remember the string is
                    // being evaluated backwards) the additional addition operator should not be added.
                    // The only time the addition operator is added is when there should be a subtraction operator.
                    if (inputStr[i-1] !== 'X' && inputStr[i-1] !== '/') {
                        operations[operationsIndex] = '+';
                        operationsIndex++;
                    }
                    num = num*-1;
                }

                // Add num to inputs array.
                inputs[inputsIndex] = num;
                inputsIndex++;

                // Clear tempStorage.
                tempIndex = 0;
                tempStorage = [];

            }
        }

    }

    // Reverse our inputs and operations.
    inputs = inputs.reverse();
    operations = operations.reverse().concat("="); // Add an = sign to the end so evaluation knows when to end.

    operationsIndex = 0; // Reset operations index to 0.
    let result = inputs[0]; // Result is assigned to the first value in inputs array.
    inputsIndex = 1; // Set inputsIndex to 1, since result already holds the first value.

    // The evaluation loop runs until end of calculation.
    while(operations[operationsIndex] !== '=') {
        result = performOperation(operations[operationsIndex], result, inputs[inputsIndex]);
        operationsIndex++;
        inputsIndex++;
    }

    return result;
}

/**
 * Performs calculations.
 *
 * @param operation :The operator (represented as a character) to calculate.
 * @param cur :First value in the calculation (left hand side).
 * @param val :Second value in the calculation (right hand side).
 * @returns {*} :Integer result of calculation.
 */
function performOperation(operation, cur, val) {
    if (cur === undefined) {
        cur = 0;
    }
    if (val === undefined) {
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
