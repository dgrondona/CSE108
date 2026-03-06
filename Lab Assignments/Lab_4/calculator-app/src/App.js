import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
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
    }

    else if (value === "AC") {
      setInput("");
    }

    else if (value === "⌫") {
      setInput(input.slice(0, -1));
    }

    else {
      setInput(input + value);
    }
  };

  const buttons = [
    { value: "⌫", type: "top" },
    { value: "AC", type: "top" },
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
    { value: "=", type: "operator" }
  ];

  return (
    <div className="calculator">

      <TextField
        value={input}
        fullWidth
        variant="outlined"
        className="display"
      />

      <Grid container spacing={1}>

        {buttons.map((btn, index) => (
          <Grid item xs={3} key={index}>
            <CalcButton
              value={btn.value}
              type={btn.type}
              onClick={handleClick}
            />
          </Grid>
        ))}

      </Grid>

    </div>
  );
}

export default App;