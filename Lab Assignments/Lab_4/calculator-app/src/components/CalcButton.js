import Button from "@mui/material/Button";

function CalcButton({ value, onClick, type }) {

  let className = "btn";

  if (type === "operator") className += " operator";
  if (type === "top") className += " top";
  if (type === "number") className += " number";

  return (
    <Button
      className={className}
      variant="contained"
      onClick={() => onClick(value)}
    >
      {value}
    </Button>
  );
}

export default CalcButton;