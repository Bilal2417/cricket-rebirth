import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

export default function MovingBallsBackground() {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const ballCount = Math.floor(window.innerWidth / 50); // Adjust count based on width
    const generatedBalls = Array.from({ length: ballCount }).map(() => ({
      size: Math.random() * 10 + 5, // 5-15px
      left: Math.random() * 100, // % from left
      duration: Math.random() * 5 + 5, // 5-10s
      delay: Math.random() * 5, // staggered start
    }));
    setBalls(generatedBalls);
  }, []);

  return (
    <Box
      component="div"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none", // Allow clicks through
        // backgroundColor: "#111", // Body background
      }}
    >
      {balls.map((ball, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            bottom: "-20px",
            left: `${ball.left}%`,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            borderRadius: "50%",
            backgroundColor: "#fff",
            animation: `moveUp ${ball.duration}s linear ${ball.delay}s infinite`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes moveUp {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(-110vh); opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
}
