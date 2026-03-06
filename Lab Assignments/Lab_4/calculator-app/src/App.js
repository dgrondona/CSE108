import { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CalcButton from "./components/CalcButton";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "=") {
      try {
        setInput(eval(input));
      } catch {
        setInput("Error");
      }
    } else if (value === "C") {
      setInput("");
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    "7","8","9","/",
    "4","5","6","*",
    "1","2","3","-",
    "0",".","=","+",
    "C"
  ];

  return (
    <div className="calculator">
      <h2>React Calculator</h2>

      <TextField
        value={input}
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <Grid container justifyContent="center">
        {buttons.map((btn) => (
          <CalcButton
            key={btn}
            value={btn}
            onClick={handleClick}
          />
        ))}
      </Grid>
    </div>
  );
}

export default App;