import Button from "@mui/material/Button";

function CalcButton({ value, onClick }) {
  return (
    <Button
      variant="contained"
      onClick={() => onClick(value)}
      style={{ margin: "5px", width: "60px", height: "60px" }}
    >
      {value}
    </Button>
  );
}

export default CalcButton;