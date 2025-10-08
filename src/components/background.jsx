import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

export default function MovingBallsBackground( {color , background , speed }) {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const ballCount = Math.floor(window.innerWidth / 45); // Adjust count based on width
    const generatedBalls = Array.from({ length: ballCount }).map(() => ({
      size: Math.random() * 10 + 5, // 5-15px
      left: Math.random() * 100, // % from left
      duration: Math.random() * 5 + speed, // 5-10s
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
        // background: "#111", // Body background
        background: background
        // background: "radial-gradient(circle, #b51c22,  #111)"
        // background: "radial-gradient(circle,  #444, #111)"
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
            backgroundColor: color,
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
