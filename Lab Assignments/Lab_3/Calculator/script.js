/* Set all of our variables */
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let lastOperator = null;
let lastSecondNumber = null;
let shouldResetDisplay = false;
let internalValue = null;

/* Element references */
const output = document.getElementById("output");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const backspace = document.getElementById("backspace");
const decimal = document.querySelector(".decimal");
const plusMinus = document.querySelector(".plusMinus");
const percentButton = document.getElementById("percent");

/* Logic for inputting numbers */
numbers.forEach(button => {

    // Event listener for if a number button is pressed
    button.addEventListener("click", () => {

        // If shouldResetDisplay is true, reset the display
        if (shouldResetDisplay) {

            output.textContent = "";
            shouldResetDisplay = false;

        }

        // To prevent leading 0s
        if (output.textContent === "0") {

            output.textContent = "";

        }

        // Add the text from the button to the output
        output.textContent += button.textContent;

        removeActiveOperator();
    });
});

/* Logic for the decimal button */
decimal.addEventListener("click", () => {

    // Display reset logic
    if (shouldResetDisplay) {

        output.textContent = "0";
        shouldResetDisplay = false;

    }

    // If there isn't a decimal already, add a decimal
    if (!output.textContent.includes(".")) {

        output.textContent += ".";

    }
});

/* Logic for the +/- button */
plusMinus.addEventListener("click", () => {

    let current = parseFloat(output.textContent);

    current = -current;

    output.textContent = formatForDisplay(current);

    if (shouldResetDisplay) {
        internalValue = current;
    }

});

/* Logic for operators buttons, like +, *, /, etc. */
operators.forEach(button => {

    button.addEventListener("click", () => {

        // Calculate if we have selected an operator and shouldResetDisplay is false
        if (currentOperator !== null && !shouldResetDisplay) {

            calculate();

        }

        // Store the first number
        firstNumber = parseFloat(output.textContent);

        // Store the selected operator
        currentOperator = button.dataset.operator;

        shouldResetDisplay = true;

        // Highlight selected operator button
        setActiveOperator(button);
    });
});

/* Logic for the equals sign */
equals.addEventListener("click", () => {

    if (currentOperator === null) {

        // If there is not operator selected & we used = previously, we repeat the last operation
        if (lastOperator !== null) {

            firstNumber = internalValue;
            secondNumber = lastSecondNumber;
            currentOperator = lastOperator;

        } else {

            return; // Otherwise, there's nothing to calc

        }
    } else {

        // Normal equals beheviour, 
        secondNumber = parseFloat(output.textContent);

        // Save previous info for repeated equals operation
        lastSecondNumber = secondNumber;
        lastOperator = currentOperator;

    }

    calculate();
    removeActiveOperator();
});

/* Do the calculation */
function calculate() {

    // Perform operation based on the selected operator
    switch (currentOperator) {
        case "+":
            internalValue = firstNumber + secondNumber;
            break;
        case "-":
            internalValue = firstNumber - secondNumber;
            break;
        case "*":
            internalValue = firstNumber * secondNumber;
            break;
        case "/":
            internalValue = firstNumber / secondNumber;
            break;
    }

    // Use full precision for future calculations
    firstNumber = internalValue;

    // Format display
    output.textContent = formatForDisplay(internalValue);

    currentOperator = null;
    shouldResetDisplay = true;
}

/* Logic for the clear button */
clear.addEventListener("click", () => {

    // Pretty much just reset everything
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    lastOperator = null;
    lastSecondNumber = null;
    output.textContent = "0";
    shouldResetDisplay = false;
    removeActiveOperator();
});

/* Logic for the backspace button */
backspace.addEventListener("click", () => {

    // Remove last character
    output.textContent = output.textContent.slice(0, -1);

    // If empty after deletion, set to "0"
    if (output.textContent === "" || output.textContent === "-") {

        output.textContent = "0";

    }
});

/* Logic for the % button */
percentButton.addEventListener("click", () => {

    // Parse the current display
    let current = parseFloat(output.textContent);

    // If we have a first number and an operator, calculate % of firstNumber
    if (firstNumber !== null && currentOperator !== null) {

        current = firstNumber * (current / 100);

    } else {

        // Otherwise, just divide by 100
        current = current / 100;

    }

    // Update display with formatting
    output.textContent = formatForDisplay(current);

    // Update internal value for repeated calculations
    internalValue = current;
    shouldResetDisplay = true;
});

/* Set the active operator, for selecting which operation is being used */
function setActiveOperator(button) {

    removeActiveOperator();
    button.classList.add("active");

}

/* Removes which operator is currently active */
function removeActiveOperator() {

    operators.forEach(op => op.classList.remove("active"));

}

/* Format display to round to 10 digits, we still keep the real number for further calculations */
function formatForDisplay(number) {

    // Seperate the negative sign
    const sign = number < 0 ? "-" : "";
    let absNum = number < 0 ? -number : number;

    // Scientific notation if too big or too small
    if (absNum >= 1e10 || (absNum > 0 && absNum < 1e-6)) {

        return sign + absNum.toExponential(6);

    }

    // Convert number to string
    let str = absNum.toString();

    // If it’s too long, truncate decimals
    if (str.includes(".")) {

        // Split into the int part in the decimal part to make sure we only take up 10 digits worth of space
        const [intPart, decPart] = str.split(".");
        const maxDecimal = 10 - intPart.length;
        str = intPart + "." + (decPart ? decPart.slice(0, maxDecimal) : "");

    } else if (str.length > 10) {

        // If integer part itself exceeds 10, use scientific notation
        return sign + absNum.toExponential(6);

    }

    return sign + str;
}