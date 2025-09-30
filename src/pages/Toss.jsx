import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Toss() {
  const [result, setResult] = useState(null);
  const [tossWin, setTossWin] = useState(false);
  const [inningsChoice, setInningsChoice] = useState(null);
  const navigate = useNavigate();

  const handleToss = (choice) => {
    const coinFlip = Math.random() < 0.5 ? "Heads" : "Tails";
    const winner = coinFlip === choice ? "user" : "ai";

    setResult(winner);
    console.log(`Coin: ${coinFlip}, Winner: ${winner}`);

    if (winner === "ai") {
      const innings = Math.random() < 0.5 ? "Bat" : "Ball";
      localStorage.setItem("Innings", innings);
      localStorage.setItem("FirstInnings", "1");
      setInningsChoice(innings);
      navigate("/gamePlay");
    } else {
      setTossWin(true);
    }
  };

  const handleInnings = (choice) => {
    localStorage.setItem("Innings", choice);
    localStorage.setItem("FirstInnings", "1");
    navigate("/gamePlay");
    window.location.reload();
  };

  return (
    <>
      {!tossWin ? (
        <Grid container xs={6} gap={10} justifyContent="center">
          {["Heads", "Tails"].map((choice, index) => (
            <Button
              key={index}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#0f0648",
                borderBottom: "2px solid #fa208e",
                borderRight: "2px solid #fa208e",
                borderRadius: "12px",
                fontFamily: "Rubik",
                fontWeight: 600,
                padding: "8px 16px",
                width: "150px",
                transform: "scale(1.1)",
                ":hover": { transform: "scale(1.2)", transition: "all 0.3s" },
              }}
              onClick={() => handleToss(choice)}
            >
              {choice}
            </Button>
          ))}
        </Grid>
      ) : (
        <Grid container xs={6} gap={10} justifyContent="center">
          {["Bat", "Ball"].map((choice, index) => (
            <Button
              key={index}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#0f0648",
                borderBottom: "2px solid #fa208e",
                borderRight: "2px solid #fa208e",
                borderRadius: "12px",
                fontFamily: "Rubik",
                fontWeight: 600,
                padding: "8px 16px",
                width: "150px",
                transform: "scale(1.1)",
                ":hover": { transform: "scale(1.2)", transition: "all 0.3s" },
              }}
              onClick={() => handleInnings(choice)}
            >
              {choice}
            </Button>
          ))}
        </Grid>
      )}
    </>
  );
}
