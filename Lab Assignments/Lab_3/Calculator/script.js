/* Set all of our variables */
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let lastOperator = null;
let lastSecondNumber = null;
let shouldResetDisplay = false;

const output = document.getElementById("output");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const decimal = document.querySelector(".decimal");

numbers.forEach(button => {
    button.addEventListener("click", () => {
        if (shouldResetDisplay) {
            output.textContent = "";
            shouldResetDisplay = false;
        }

        if (output.textContent === "0")
            output.textContent = "";

        output.textContent += button.textContent;

        removeActiveOperator();
    });
});

decimal.addEventListener("click", () => {
    if (shouldResetDisplay) {
        output.textContent = "0";
        shouldResetDisplay = false;
    }

    if (!output.textContent.includes(".")) {
        output.textContent += ".";
    }
});

operators.forEach(button => {
    button.addEventListener("click", () => {

        if (currentOperator !== null && !shouldResetDisplay) {
            calculate();
        }

        firstNumber = parseFloat(output.textContent);
        currentOperator = button.textContent;
        shouldResetDisplay = true;

        setActiveOperator(button);
    });
});

equals.addEventListener("click", () => {

    if (currentOperator === null) {
        if (lastOperator !== null) {
            firstNumber = parseFloat(output.textContent);
            secondNumber = lastSecondNumber;
            currentOperator = lastOperator;
        } else {
            return;
        }
    } else {
        secondNumber = parseFloat(output.textContent);
        lastSecondNumber = secondNumber;
        lastOperator = currentOperator;
    }

    calculate();
    removeActiveOperator();
});

function calculate() {
    let result;

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

clear.addEventListener("click", () => {
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    lastOperator = null;
    lastSecondNumber = null;
    output.textContent = "0";
    shouldResetDisplay = false;
    removeActiveOperator();
});

function setActiveOperator(button) {
    removeActiveOperator();
    button.classList.add("active");
}

function removeActiveOperator() {
    operators.forEach(op => op.classList.remove("active"));
}