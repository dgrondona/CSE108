import Button from "@mui/material/Button";

function CalcButton({ value, type, onClick, active }) {

  let className = "btn";

  if (type === "number") className += " number";
  if (type === "operator") className += " operator";
  if (type === "top") className += " top";
  if (type === "equals") className += " equals";
  if (type === "clear") className += " clear";

  if (active) className += " active";

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