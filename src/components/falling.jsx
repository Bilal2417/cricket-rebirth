import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { GiTwoCoins } from "react-icons/gi";
import { MonetizationOn } from "@mui/icons-material";

export default function Falling({ color, background, speed }) {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const ballCount = Math.floor(window.innerWidth / 110); // Adjust count based on width
    const generatedBalls = Array.from({ length: ballCount }).map(() => ({
      size: 35, // 5-15px
      left: Math.random() * 100, // % from left
      duration: 3, // 5-10s
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
        pointerEvents: "none",
        background: background,
      }}
    >
      {balls.map((ball, index) => (
        <MonetizationOn
          key={index}
          sx={{
            position: "absolute",
            top: "-50px",
            left: `${ball.left}%`,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            borderRadius: "50%",
            color: color,
            background: "#000000",
            animation: `moveUp ${ball.duration}s linear ${ball.delay}s infinite`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes moveUp {
            0% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) rotateX(360deg) rotateY(360deg); }
          }
        `}
      </style>
    </Box>
  );
}
