const addition = document.getElementById('additionOperator')
const subtraction = document.getElementById('subtractionOperator')
const multiplication = document.getElementById('multiplicationOperator')
const division = document.getElementById('divisionOperator')

let result = document.getElementById('result')
let polynomialResult = document.getElementById('polynomialResult')
let absoluteErrorResult = document.getElementById('absoluteErrorResult')
let relativeErrorResult = document.getElementById('relativeErrorResult')
let maximumErrorResult = document.getElementById('maximumErrorResult')
let significantDigitsResult = document.getElementById('significantDigitsResult')

let p;
let rawResult;

const solve = document.getElementById('submitBtn')
solve.addEventListener('click', () => {
    let value1 = parseFloat(document.getElementById('firstNum').value)
    let value2 = parseFloat(document.getElementById('secondNum').value)
    
    const selectedElement = document.getElementById('operation')
    let selectedValue = selectedElement.value
    
    console.log('clicked solve button')
    switch (selectedValue) {
        case "addition":
            console.log('user chose addition')
            addNums(value1, value2)
            break;
        case "subtraction":
            subtractNums(value1, value2)
            break;
        case "multiplication":
            multiplyNums(value1, value2)
            break;
        case "division":
            divideNums(value1, value2)
            break;
        default:
            break;
    }
    
    rawResult = p
    result.textContent = p
    absoluteErrorResult.textContent = '-'
    relativeErrorResult.textContent = '-'
    maximumErrorResult.textContent = '-'
    significantDigitsResult.textContent = '-'
})

const applyChopRoundBtn = document.getElementById('applyChopRoundBtn')
applyChopRoundBtn.addEventListener('click', () => {
    if (rawResult === undefined) {
        alert('Please calculate a result first')
        return
    }
    
    let selectedMethod = document.querySelector('input[name="method"]:checked').value
    let isDouble = document.getElementById('double').checked
    let significantValue = document.getElementById('significantDigits').value
    
    if (!significantValue) {
        alert('Please enter number of significant digits')
        return
    }
    
    if (!isDouble) {
        if (selectedMethod == "chop") {
            p = chopNums(rawResult, significantValue)
        } else {
            p = roundNums(rawResult, significantValue)
        }
    } else {
        // Double chop/round: process inputs, operate, process result
        let value1 = parseFloat(document.getElementById('firstNum').value)
        let value2 = parseFloat(document.getElementById('secondNum').value)
        const selectedElement = document.getElementById('operation')
        let selectedOp = selectedElement.value
        
        // Process inputs
        let processedValue1, processedValue2;
        if (selectedMethod == "chop") {
            processedValue1 = chopNums(value1, significantValue)
            processedValue2 = chopNums(value2, significantValue)
        } else {
            processedValue1 = roundNums(value1, significantValue)
            processedValue2 = roundNums(value2, significantValue)
        }
        
        // Perform operation on processed inputs
        let intermediate;
        switch (selectedOp) {
            case "addition":
                intermediate = processedValue1 + processedValue2;
                break;
            case "subtraction":
                intermediate = processedValue1 - processedValue2;
                break;
            case "multiplication":
                intermediate = processedValue1 * processedValue2;
                break;
            case "division":
                intermediate = processedValue1 / processedValue2;
                break;
        }
        
        // Process the result again
        if (selectedMethod == "chop") {
            p = chopNums(intermediate, significantValue)
        } else {
            p = roundNums(intermediate, significantValue)
        }
        
        // For errors, use intermediate as rawResult
        rawResult = intermediate;
    }
    
    displayResultWithErrors(p, rawResult, significantValue)
})


function addNums(value1, value2) {
    p = value1 + value2
    return p 
}

function subtractNums(value1, value2) {
    p = value1 - value2
    return p
}

function multiplyNums(value1, value2) {
    p = value1 * value2
    return p
}

function divideNums(value1, value2) {
    p = value1 / value2
    return p
}


function displayResult(p) {
    console.log('displayed result')
    result.textContent = p
}

function displayResultWithErrors(processedResult, rawResult, significantDigits) {
    console.log('displayed result with errors')
    
    result.textContent = processedResult
    
    const absError = absoluteError(rawResult, processedResult)
    absoluteErrorResult.textContent = absError.toFixed(10)
    
    const relError = relativeError(rawResult, processedResult)
    relativeErrorResult.textContent = relError.toExponential(5)
    
    const maxError = maximumAbsoluteError(0.5, Math.pow(10, -(significantDigits)))
    maximumErrorResult.textContent = maxError.toExponential(5)
    
    significantDigitsResult.textContent = significantDigits
}

function roundNums(p, digit) {
    return Number(p.toFixed(digit));
}

let chopped;
function chopNums(p, digit) {
    let factor = Math.pow(10, digit);
    return chopped = Math.trunc(p * factor) / factor;
}

function normalize(RelativeError) {
    for (let t = -20; t < 20; t++) {
        if (RelativeError <= 5 * Math.pow(10, t)) {
            return t
        }
    }
}

function absoluteError(p, pe) {
    return Math.abs(p - pe)
}

function relativeError(p, pe) {
    return Math.abs((p - pe) / pe)
}


function maximumAbsoluteError(SignificantDigit, p) {
    return SignificantDigit * p
}

function evalPolynomial(expression, scope) {
    try {
        return math.evaluate(expression, scope);
    }
    catch (error) {
        return "Error: " + error.message;
    }
}

const polynomialBtn = document.getElementById('evaluatePolynomialBtn')

polynomialBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const expression = document.getElementById('polynomialFunction').value;
    const variableValue = parseFloat(document.getElementById('polynomialVariable').value);
    
    if (!expression || isNaN(variableValue)) {
        alert('Please enter both a polynomial function and a value for x');
        return;
    }
    
    const scope = { x: variableValue };
    const polyResult = evalPolynomial(expression, scope);
    polynomialResult.textContent = polyResult;
})

// Section 4: evaluate errors given P and P*
const extraBtn = document.getElementById('extraBtn');
extraBtn.addEventListener('click', () => {
    const pVal = parseFloat(document.getElementById('pValue').value);
    const pStarVal = parseFloat(document.getElementById('pStarValue').value);
    const sigDigits = parseInt(document.getElementById('extraSignificantDigits').value);

    if (isNaN(pVal) || isNaN(pStarVal)) {
        alert('Please enter both P and P* values');
        return;
    }
    if (isNaN(sigDigits)) {
        alert('Please enter number of significant digits');
        return;
    }

    // compute errors
    const absErr = absoluteError(pVal, pStarVal);
    const relErr = relativeError(pVal, pStarVal);
    const maxErr = maximumAbsoluteError(0.5, Math.pow(10, -sigDigits));

    // update UI
    document.getElementById('extraPStar').textContent = pStarVal;
    document.getElementById('extraAbsoluteError').textContent = absErr.toFixed(10);
    document.getElementById('extraRelativeError').textContent = relErr.toExponential(5);
    document.getElementById('extraMaximumError').textContent = maxErr.toExponential(5);
    document.getElementById('extraSignificantDigitsResult').textContent = sigDigits;
});

// Section 5: Binary conversion
const decToBinBtn = document.getElementById('decToBinBtn');
const binToDecBtn = document.getElementById('binToDecBtn');

decToBinBtn.addEventListener('click', () => {
    const decimalVal = parseFloat(document.getElementById('decimalInput').value);
    
    if (isNaN(decimalVal)) {
        alert('Please enter a valid decimal number');
        return;
    }
    
    // Split into integer and fractional parts
    const intPart = Math.floor(Math.abs(decimalVal));
    const fracPart = Math.abs(decimalVal) - intPart;
    
    // Convert integer part to binary
    let binaryVal = intPart.toString(2);
    
    // Convert fractional part to binary (up to 20 digits for precision)
    if (fracPart > 0) {
        binaryVal += '.';
        let frac = fracPart;
        for (let i = 0; i < 20 && frac > 0; i++) {
            frac *= 2;
            binaryVal += Math.floor(frac);
            frac -= Math.floor(frac);
        }
    }
    
    // Handle negative numbers
    if (decimalVal < 0) {
        binaryVal = '-' + binaryVal;
    }
    
    document.getElementById('binaryBinaryResult').textContent = binaryVal;
    document.getElementById('binaryDecimalResult').textContent = decimalVal;
});

binToDecBtn.addEventListener('click', () => {
    const binaryVal = document.getElementById('binaryInput').value;
    
    if (!binaryVal || !/^[01]+(\.[01]+)?$/.test(binaryVal)) {
        alert('Please enter a valid binary number (only 0s, 1s, and optional decimal point)');
        return;
    }
    
    // Handle decimal point if present
    let decimalVal = 0;
    if (binaryVal.includes('.')) {
        const [intPart, fracPart] = binaryVal.split('.');
        
        // Convert integer part
        if (intPart) {
            decimalVal += parseInt(intPart, 2);
        }
        
        // Convert fractional part
        if (fracPart) {
            for (let i = 0; i < fracPart.length; i++) {
                if (fracPart[i] === '1') {
                    decimalVal += Math.pow(2, -(i + 1));
                }
            }
        }
    } else {
        decimalVal = parseInt(binaryVal, 2);
    }
    
    document.getElementById('binaryDecimalResult').textContent = decimalVal;
    document.getElementById('binaryBinaryResult').textContent = binaryVal;
});