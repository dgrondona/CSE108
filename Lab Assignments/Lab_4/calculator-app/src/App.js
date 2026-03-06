import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CalcButton from "./components/CalcButton";
import "./App.css";

function App() {

  const [display, setDisplay] = useState("0");
  const [firstNum, setFirstNum] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [lastSecond, setLastSecond] = useState(null);
  const [activeOperator, setActiveOperator] = useState(null);

  const calculate = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return a / b;
      default: return b;
    }
  };

  const handleNumber = (num) => {

    if (waitingForSecond) {
      setDisplay(num);
      setWaitingForSecond(false);
      setActiveOperator(null);
    }
    else {
      setDisplay(display === "0" ? num : display + num);
    }

  };

  const handleDecimal = () => {

    if (waitingForSecond) {
      setDisplay("0.");
      setWaitingForSecond(false);
      setActiveOperator(null);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }

  };

  const handleOperator = (op) => {

    const current = parseFloat(display);

    if (firstNum === null) {
      setFirstNum(current);
    }
    else if (!waitingForSecond) {
      const result = calculate(firstNum, current, operator);
      setDisplay(String(result));
      setFirstNum(result);
    }

    setWaitingForSecond(true);
    setOperator(op);
    setActiveOperator(op);

  };

  const handleEquals = () => {

    if (operator === null) return;

    const current = parseFloat(display);

    let second = waitingForSecond ? lastSecond : current;

    const result = calculate(firstNum, second, operator);

    setDisplay(String(result));
    setFirstNum(result);
    setLastSecond(second);
    setWaitingForSecond(true);
    setActiveOperator(null);

  };

  const handleClear = () => {
    setDisplay("0");
    setFirstNum(null);
    setOperator(null);
    setLastSecond(null);
    setWaitingForSecond(false);
    setActiveOperator(null);
  };

  const handleBackspace = () => {

    if (display.length === 1) {
      setDisplay("0");
    }
    else {
      setDisplay(display.slice(0, -1));
    }

  };

  const buttons = [
    { value: "⌫", type: "clear" },
    { value: "AC", type: "clear" },
    { value: "%", type: "top" },
    { value: "/", type: "operator" },

    { value: "7", type: "number" },
    { value: "8", type: "number" },
    { value: "9", type: "number" },
    { value: "*", type: "operator" },

    { value: "4", type: "number" },
    { value: "5", type: "number" },
    { value: "6", type: "number" },
    { value: "-", type: "operator" },

    { value: "1", type: "number" },
    { value: "2", type: "number" },
    { value: "3", type: "number" },
    { value: "+", type: "operator" },

    { value: "+/-", type: "top" },
    { value: "0", type: "number" },
    { value: ".", type: "number" },
    { value: "=", type: "equals" }
  ];

  const handleClick = (value) => {

    if (!isNaN(value)) handleNumber(value);

    else if (value === ".") handleDecimal();

    else if (value === "+" || value === "-" || value === "*" || value === "/")
      handleOperator(value);

    else if (value === "=") handleEquals();

    else if (value === "AC") handleClear();

    else if (value === "⌫") handleBackspace();

    else if (value === "+/-")
      setDisplay(String(parseFloat(display) * -1));

    else if (value === "%")
      setDisplay(String(parseFloat(display) / 100));

  };

  return (

    <div className="app">

      <div className="calculator">

        <TextField
          value={display}
          variant="outlined"
          className="display"
        />

        <Grid container spacing={1}>

          {buttons.map((btn, index) => (

            <Grid
              item
              xs={btn.value === "0" ? 6 : 3}
              key={index}
            >

              <CalcButton
                value={btn.value}
                type={btn.type}
                onClick={handleClick}
                active={activeOperator === btn.value}
              />

            </Grid>

          ))}

        </Grid>

      </div>

    </div>

  );
}

export default App;