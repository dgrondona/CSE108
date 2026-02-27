/* Set all of our variables */
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let lastOperator = null;
let lastSecondNumber = null;
let shouldResetDisplay = false;

/* Element references */
const output = document.getElementById("output");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const decimal = document.querySelector(".decimal");

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
        currentOperator = button.textContent;

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

            firstNumber = parseFloat(output.textContent);
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
    let result;

    // Perform operation based on the selected operator
    switch (currentOperator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "*":
            result = firstNumber * secondNumber;
            break;
        case "/":
            result = firstNumber / secondNumber;
            break;
    }

    output.textContent = result;
    firstNumber = result;
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

/* Set the active operator, for selecting which operation is being used */
function setActiveOperator(button) {

    removeActiveOperator();
    button.classList.add("active");

}

/* Removes which operator is currently active */
function removeActiveOperator() {

    operators.forEach(op => op.classList.remove("active"));
    
}